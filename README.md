# Calendar Generator
Project of Calendar Generator for the purposes of IDMN OF - CFA.

# Installation
- Git v2.40.1
- Node.js v19.9.0

The requirements can be installed by running the script ``install.bat``.
This script checks if ``git`` and ``node`` commands are avaible on the system. If isn't, it installs and setups the requirements.
Then, script automatically setup Git repository if needed and install npm packages.
Finally, it creates a shortcut named ``Generateur Planning`` on the user desktop.
<br>
-> TIPS : If shortcut doesn't appear on user desktop, you can create a shortcut of ``run.bat`` file.

# Run
To start the software, double-click on the shortcut ``Generateur Planning`` located on the user desktop.
This script automatically checks if there is an update, then it starts the software.

# Settings
Settings storage is located to ``project_root/src/config/*.json``.
<br>
-> TIPS : It's easier to manage all the settings from the settings manager of the software.

# Generate a PDF
Starts the application, fill all the student/formation data and click on ``Générer``.
After generating the calendar, days can be editing by selecting a color in the color picker (left corner) and then clicking on a day.
Month hours and total hours are automatically calculated.
When calendar editing is finished, a PDF preview can be created by clicking on the PDF button (right corner).
If the calendar suits you, PDF can be saved by clicking on the save button (right of the calendar title).
A popup will appear to allow you to choose the folder where the PDF will be saved.
