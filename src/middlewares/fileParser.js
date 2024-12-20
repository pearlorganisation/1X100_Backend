import formidable from "formidable";

const fileParser = (req, res, next) => {
  const form = formidable();

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error("Error parsing the files", err);
      return next(err);
    }
    req.body = req.body || {};

    for (const key in fields) {
      if (fields[key]) {
        const value = fields[key][0];

        try {
          req.body[key] = JSON.parse(value);
        } catch (e) {
          req.body[key] = value;
        }

        if (!isNaN(req.body[key])) {
          req.body[key] = Number(req.body[key]);
        }
      }
    }

    req.files = req.files || {};

    // Convert files to req.files
    for (const key in files) {
      const actualFiles = files[key];
      if (!actualFiles) break;

      if (Array.isArray(actualFiles)) {
        req.files[key] = actualFiles.length > 1 ? actualFiles : actualFiles[0];
      } else {
        req.files[key] = actualFiles;
      }
    }
    next();
  });
};

export default fileParser;
