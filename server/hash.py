import sys
from pathlib import Path
import base64

def hashFile(f):
    hash = b''
    sz = Path(f).stat().st_size
    with open(f, "rb") as f:
        i = 1
        while i < sz:
            f.seek(i)
            hash += f.read(1)
            i = i << 1
    return base64.b16encode(hash).decode()

if __name__ == '__main__':
    f = sys.argv[1]
    hashFile(f=f, sz=None)
    