const { spawn } = require('child_process');
const fs = require('fs');
// Check if TypeScript compil

  const tsc = spawn('node', [tscPath, '-
    stdio: 'pipe'

  tsc.stdout.on('data', (data
  const tsc = spawn('node', [tscPath, '--noEmit'], { 
    cwd: __dirname,
    stdio: 'pipe'
  tsc

      console.log(
      console.log('No compilation e
  });
  con










    } else {
      console.log('No compilation errors found!');
    }
  });
} else {

