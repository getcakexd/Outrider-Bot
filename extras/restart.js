const { spawn } = require('child_process');

function runScript(script, args = []) {
    return new Promise((resolve, reject) => {
        const process = spawn('node', [script, ...args], { stdio: 'inherit' });
        process.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(`Script ${script} exited with code ${code}`));
            } else {
                resolve();
            }
        });
    });
}

async function startApp() {
    try {
        // Run the setup script before starting the main application
        await runScript('deploy-commands.js');

        // Now start the main application
        const app = spawn('node', ['index.js'], { stdio: 'inherit' });

        app.on('close', (code) => {
            if (code !== 0) {
                console.log('Application crashed! Attempting to restart...');
                startApp();
            }
        });

        app.on('error', (error) => {
            console.error('Error occurred:', error);
        });
    } catch (error) {
        console.error('Failed to run setup script:', error);
    }
}

startApp();
