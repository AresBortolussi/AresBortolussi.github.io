"""Generate public examples from synthetic inputs using the actual project code.
Requires the three source checkouts (currently private), SQL Toolkit's installed
CLI, a C compiler and GHDL. Never reads user datasets or contacts hardware.
Run from the portfolio checkout; --projects points to the parent of the repos.
"""
import argparse
import ctypes as c
import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'assets/examples'

def run(args, **kwargs):
    return subprocess.run(list(map(str,args)),check=True,capture_output=True,text=True,**kwargs).stdout

def generate(projects,ghdl):
    OUT.mkdir(parents=True,exist_ok=True)
    sql,visit,fpga=[projects/name for name in ('sql-toolkit','visit-ledger','entropy-bridge')]
    commands=[]
    with tempfile.TemporaryDirectory(prefix='portfolio-demo-') as directory:
        tmp=Path(directory)
        schema=tmp/'library.sql'
        schema.write_text('''CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT NOT NULL);
CREATE TABLE members (id INTEGER PRIMARY KEY, alias TEXT NOT NULL);
CREATE TABLE loans (
  id INTEGER PRIMARY KEY,
  book_id INTEGER NOT NULL,
  member_id INTEGER NOT NULL,
  loan_date TEXT NOT NULL,
  FOREIGN KEY (book_id) REFERENCES books(id),
  FOREIGN KEY (member_id) REFERENCES members(id)
);
''')
        cli=sql/'.venv/bin/sqltoolkit'
        model=tmp/'schema.json'
        run([cli,'import-ddl',schema,'-o',model])
        outputs={'library.sql':schema.read_text(),'schema.json':model.read_text()}
        for command,name in [('validate','validation.json'),('erd','schema.dot'),('docs','schema.md'),('sqlite-ddl','generated.sql'),('plan','plan.json')]:
            outputs[name]=run([cli,command,model])
        commands+=['sqltoolkit import-ddl library.sql -o schema.json','sqltoolkit validate schema.json','sqltoolkit erd schema.json','sqltoolkit docs schema.json','sqltoolkit sqlite-ddl schema.json','sqltoolkit plan schema.json']
        for name,content in outputs.items(): (OUT/name).write_text(content)
        data=tmp/'visits.csv'
        data.write_text('''restaurant,date,time,name,cost,vote
Forno Aurora,2026-09-05,13:00,Demo,12.50,4.0
Orto Blu,2026-09-12,13:00,Demo,22.00,4.0
Bistrot Quarzo,2026-09-19,20:00,Demo,30.00,4.5
Forno Aurora,2026-10-03,13:00,Demo,13.50,4.5
Orto Blu,2026-10-10,13:00,Demo,24.00,4.5
Bistrot Quarzo,2026-10-17,20:00,Demo,34.00,5.0
''')
        # Compile in a temporary directory; preserve existing source trees/builds.
        binary=tmp/'ape'
        local=tmp/'visit-source'
        shutil.copytree(visit/'src',local/'src')
        shutil.copytree(visit/'third_party/yyjson',local/'third_party/yyjson')
        (local/'build').mkdir()
        (local/'build/version.h').write_text('#define APE_VERSION '+json.dumps((visit/'VERSION').read_text().strip())+'\n')
        sources=['main.c','ingest.c','data.c','visitio.c','visitio_normalize.c','visitio_json.c']
        run(['cc','-O2','-std=c17',*[local/'src'/s for s in sources],local/'third_party/yyjson/yyjson.c','-lm','-o',binary])
        shutil.copyfile(data,OUT/'visits.csv')
        for command,name in [('validate','visits-validation.json'),('stats','visits-stats.json'),('timeline','visits-timeline.json')]:
            output=run([binary,command,'--input',data,'--reader','c','--format','json'])
            (OUT/name).write_text(output)
            commands.append(f'ape {command} --input visits.csv --reader c --format json')
        text=run([binary,'stats','--input',data,'--reader','c'])
        (OUT/'visits-stats.txt').write_text(text)
        # Reference samples plus actual HDL assertion check, no physical hardware.
        library=tmp/'fir.dylib'
        run(['cc','-shared','-fPIC','-std=c17','-I',fpga/'include',fpga/'src/dsp.c','-o',library])
        lib=c.CDLL(str(library))
        class State(c.Structure): _fields_=[('history',c.c_int16*3)]
        lib.eb_fir4_process.argtypes=[c.POINTER(State),c.POINTER(c.c_int16),c.POINTER(c.c_int16),c.c_size_t]
        samples=[0,0,8000,0,0,0,0,32767,32767,32767,32767,-32768,-32768,-32768,-32768,0,0,0,0]
        inp=(c.c_int16*len(samples))(*samples); out=(c.c_int16*len(samples))();state=State()
        assert lib.eb_fir4_process(c.byref(state),inp,out,len(samples))==0
        vectors='1 0 1 0 0 0\n'+''.join(f'0 1 1 {x} 1 {y}\n' for x,y in zip(samples,out))
        (tmp/'fir_vectors.txt').write_text(vectors)
        run([ghdl,'-a','--std=08',fpga/'gateware/stream_fir4.vhd',fpga/'gateware/tb_stream_fir4.vhd'],cwd=tmp)
        run([ghdl,'-e','--std=08','tb_stream_fir4'],cwd=tmp)
        result=run([ghdl,'-r','--std=08','tb_stream_fir4','--assert-level=error'],cwd=tmp)
        (OUT/'fir-samples.json').write_text(json.dumps({'source':'synthetic-input / C reference checked by VHDL assertions in GHDL','physical_hardware':False,'input':samples,'output':list(out),'hdl_assertions_passed':True},indent=2)+'\n')
        # Keep public logs free of local absolute paths and generated temporary names.
        (OUT/'fir-check.txt').write_text('\n'.join(line[line.index('(report note):'):] if '(report note):' in line else line for line in result.splitlines())+'\n')
        commands+=['cc -shared -fPIC -std=c17 -I include src/dsp.c -o fir.dylib','ghdl -a --std=08 stream_fir4.vhd tb_stream_fir4.vhd','ghdl -e --std=08 tb_stream_fir4','ghdl -r --std=08 tb_stream_fir4 --assert-level=error']
    manifest={'tools':{'ghdl':run([ghdl,'--version']).splitlines()[0],'cc':run(['cc','--version']).splitlines()[0]},'data':'All inputs are invented demonstration fixtures, not personal or customer data.','commands':commands,'source_commits':{p.name:run(['git','-C',p,'rev-parse','HEAD']).strip() for p in [sql,visit,fpga]},'sha256':{f.name:hashlib.sha256(f.read_bytes()).hexdigest() for f in sorted(OUT.iterdir()) if f.suffix in ('.sql','.json','.dot','.md','.csv','.txt') and f.name!='manifest.json'}}
    (OUT/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
    print('Generated synthetic examples, actual CLI output and checked FIR samples:',OUT)

if __name__=='__main__':
    a=argparse.ArgumentParser(description=__doc__);a.add_argument('--projects',type=Path,default=ROOT.parent);a.add_argument('--ghdl',default=os.environ.get('GHDL','ghdl'));args=a.parse_args();generate(args.projects.resolve(),args.ghdl)
