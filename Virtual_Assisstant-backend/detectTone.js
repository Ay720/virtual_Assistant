import { exec } from "child_process";

export const detectTone = (audioPath) => {
  return new Promise((resolve, reject) => {
    exec(`python tone_detect.py ${audioPath}`, (error, stdout) => {
      if (error) {
        reject(error);
      } else {
        resolve(JSON.parse(stdout));
      }
    });
  });
};
