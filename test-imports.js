// Simple test to check if imports work
  con
  console.log('Testing imports...');
  
  // Test if we can read the main files
  const fs = require('fs');
  
  const appContent = fs.readFileSync('./src/App.tsx', 'utf8');
  const messagesContent = fs.readFil
  
  const importErrors = [];
  if (appContent.includes('import') && !ap
  
  if (importErrors.length > 0) {
  } else {
  
} catch (error) {
}


  const importErrors = [];
  




  if (importErrors.length > 0) {

  } else {


  
} catch (error) {

}