import os

THUMBNAIL_DIR = '.thumbnails'

generating = set()

def check_if_already_generated(file_name):
    if not os.path.exists(THUMBNAIL_DIR):
        os.makedirs(THUMBNAIL_DIR)
    thumb_dir = os.path.join(THUMBNAIL_DIR, file_name)
    return os.path.exists(thumb_dir)

def check_if_generating(file_path):
    if file_path in generating:
        return True
    else:
        return False
 
def generate_thumbnail(file_path):
    generating.add(file_name)
    file_name = os.path.basename(file_path)
    thumb_dir = os.path.join(THUMBNAIL_DIR, file_name)




    generating.remove(file_name)
    pass