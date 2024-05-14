import sys
from pathlib import Path
import base64

def hashFile(f, len):
    i = 1
    hash = b''
    while i < len:
        f.seek(i)
        hash += f.read(1)
        i = i << 1
    return base64.b16encode(hash)

if __name__ == '__main__':
    file = sys.argv[1]

    sz = Path(file).stat().st_size
    with open(file, "rb") as f:
        hash = hashFile(f, sz).decode()
        print(hash, len(hash))
    
