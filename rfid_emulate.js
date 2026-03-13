// rfid_emulate.js
// Load a .rfid file and emulate it as an NFC tag (PN532 I2C required).
// Place this file on your SD card and run it from the JS Interpreter menu.

var dialog = require('dialog');
var rfid   = require('rfid');
var display = require('display');

while (true) {
    // Pick a .rfid file from the SD card
    var filepath = dialog.pickFile('/', 'rfid');

    // Empty string means the user cancelled
    if (!filepath || filepath === '') break;

    // Load the file into the RFID module (accepts full paths)
    var tag = rfid.load(filepath);

    if (!tag) {
        dialog.error('Failed to load file.\nCheck that it is a valid .rfid file.', true);
        continue;
    }

    // Show tag info and ask to proceed
    var info = 'UID:  ' + tag.uid + '\nType: ' + tag.type;
    var choice = dialog.message(info, { left: 'Emulate', right: 'Cancel' });

    if (choice !== 'Emulate') continue;

    dialog.info('Hold your device near\na reader to emulate.\n\nPress ESC to stop.');

    // Emulate the loaded tag (blocks until reader interaction or timeout/ESC)
    var result = rfid.emulate();

    rfid.clear();

    if (result.success) {
        dialog.success('Done!\n' + result.message, true);
    } else {
        dialog.error(result.message, true);
    }
}
