import multer from 'multer';
import path from 'path'

const storage = multer.diskStorage({
    destination: "./uploads",
    filename: (req, file, callback) => {
      return callback(
        null,
        `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
      );
    },
  });

  const upload = multer({ storage: storage });

  // Handling Multer errors
  export function errorHandle(err: { message: any; }, req: any, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { ok: boolean; message: string; }): void; new(): any; }; }; }, next: any) {
    if (err instanceof multer.MulterError) {
      res.status(400).json({ ok: false, message: err.message });
    }
  }
  export default  upload;