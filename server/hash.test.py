import sys
from pathlib import Path
from hash import hashFile
from datetime import datetime

f = sys.argv[1]

test = {}

def iter_and_hash(dirr):
    for fd in Path(dirr).iterdir():
        if (fd.is_dir()):
            iter_and_hash(fd)
        else:
            start = datetime.now()
            name = fd.name
            hash = hashFile(fd)
            end = datetime.now()

            print(f'hash time : {end - start} file:"{name}"') 

            if hash in test:
                print(f"\n\nFAILED: \n{hash}:::{name}\n{hash}:::{test.get(hash)}")

            test[hash] = name

fd = Path(f)
if not fd.exists() and fd.is_dir():
    print("invalid dir")

iter_and_hash(fd)
print(f"FIN, tested {len(test)} files")

print(test)