import { NextResponse } from 'next/server'
import { exec } from 'child_process'

export async function GET() {
  return new Promise((resolve) => {
    // Windows pe PID 36404 ko force kill karein, ya generic port 3000 process ko kill karein
    exec('taskkill /F /PID 36404', (err, stdout, stderr) => {
      if (err) {
        // Agar PID change ho gayi hai, toh port 3000 process find karke kill karein
        exec('cmd /c "for /f \"tokens=5\" %a in (\'netstat -aon ^| findstr 3000\') do taskkill /F /PID %a"', (e, o, se) => {
          resolve(NextResponse.json({
            success: !e,
            message: o || se || e?.message || 'Tried killing port 3000'
          }))
        })
      } else {
        resolve(NextResponse.json({
          success: true,
          stdout,
          stderr
        }))
      }
    })
  })
}
