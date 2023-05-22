import Config from "./config/config.js";
import { DayColor, DayType } from "./calendar_ui/Day.js";
import { ColorPicker, SelectedColor } from "./calendar_ui/ColorPicker.js";
import { Calendar } from "./calendar_ui/Calendar.js";
const { jsPDF } = require("jspdf");
const html2canvas = require("html2canvas");

/* Load Application Config */
let appConfig = new Config();

/* Selected Color */
let selectedClr = new SelectedColor(DayType.None);

/* Calendar */
let calendarObj = new Calendar();

/* PDF Button */
let pdfButton = document.getElementById('pdf-button');
pdfButton.disabled = true;

/* Fullscreen */
var nwin = nw.Window.get();
nwin.maximize()

function generateCalendar() {
    pdfButton.disabled = true;
    const formationDay = document.getElementById('formation-day-select').value;
    const beginDate = new Date(document.getElementById('dateInput').value);
    beginDate.setHours(0);
    const beginMonth = new Date(beginDate.getFullYear(), beginDate.getMonth(), 1);

    let maxMonth = 12;
	if (beginDate.getDate() >= 11) {
		maxMonth = 13;
	}

    const calendarHTML = document.getElementById('calendar');
    calendarHTML.style.width = `${maxMonth * 87 + 6}px`;

    // Update calendar title
    let years;
    if (beginDate.getMonth() + maxMonth >= 13) {
		years = `Calendrier ${beginDate.getFullYear()}/${beginDate.getFullYear() + 1}`;
	} else {
		years = `Calendrier ${beginDate.getFullYear()}`;
	}
    document.getElementById('year-header').innerText = years;

    // Create Month "widget"
    calendarObj.generate(maxMonth, beginMonth, beginDate, formationDay, appConfig, selectedClr);

    // Enable PDF Button
    pdfButton.disabled = false;
}

function createDialogWindow(is_minimum) {
    /* Dialog Box */
    let mouseCheck = false;
    let dialogBox = document.createElement("div");
    dialogBox.classList.add("dialog-box");
    dialogBox.onclick = function() {
        if (!mouseCheck)
            document.body.removeChild(dialogBox);
    }
    document.body.appendChild(dialogBox);

    /* Container */
    let container = document.createElement("div");
    container.classList.add(is_minimum && "dialog-box-container-min" || "dialog-box-container");
    container.id = "dialog-box-container";
    container.onmouseenter = function() {
        mouseCheck = true;
    }
    container.onmouseleave = function() {
        mouseCheck = false;
    }
    dialogBox.appendChild(container);

    return {container, dialogBox};
}

function openPDFMenu() {
    let {container} = createDialogWindow();

    let pdfDocument = document.createElement("div");
    pdfDocument.classList.add("dialog-box-pdf");
    container.appendChild(pdfDocument);

    /* Header */
    let header = document.createElement("div");
    header.classList.add("header-pdf");
    pdfDocument.appendChild(header);

    /* Icon */
    let icon = document.createElement("img");
    icon.classList.add("logo-idmn");
    icon.src = "assets/idmn_logo.png";
    header.appendChild(icon);

    let headerTitles = document.createElement("div");
    headerTitles.classList.add("header-titles");
    header.appendChild(headerTitles);

    /* Title */
    let title = document.createElement("h1");
    title.classList.add("header-title");
    let calendarTitleTxt = document.getElementById("year-header");
    let splitStr = calendarTitleTxt.innerText.split(" ");
    title.innerText = `Planning de Formation ${splitStr[1]}`;
    headerTitles.appendChild(title);

    /* Subtitle */
    let subtitle = document.createElement("h1");
    subtitle.classList.add("header-subtitle");
    let formationType = document.getElementById("formation-type-select");
    subtitle.innerText = formationType.options[formationType.selectedIndex].text;
    headerTitles.append(subtitle);

    let studentNameInput = document.getElementById("name");
    let studentFirstnameInput = document.getElementById("firstname");

    /* Save Button */
    let fileExplorer = document.createElement("input");
    fileExplorer.type = "file";
    fileExplorer.id = "fileexplorer-input";
    fileExplorer.style.display = "none";
    fileExplorer.nwdirectory = true;
    fileExplorer.onchange = function() {
        saveButton.style.display = "none";
        var source = document.getElementById("dialog-box-container");
        let doc = jsPDF({
            orientation: 'landscape',
            unit: 'px',
            format: 'a4',
            hotfixes: ['px_scaling'],
        });
        var rect = source.getBoundingClientRect();
        html2canvas(source, {
            width: rect.width,
            height: rect.height,
        }).then((canvas) => {
            const img = canvas.toDataURL("image/png");
            doc.addImage(img, "PNG", 0, 0, rect.width, rect.height);
            doc.save(`${fileExplorer.value}/${studentNameInput.value}_${studentFirstnameInput.value}_calendrier.pdf`);
        });
    }
    header.appendChild(fileExplorer);

    let saveButton = document.createElement("button");
    saveButton.id = "save-button";
    saveButton.classList.add("header-button");
    saveButton.onclick = function() {
        fileExplorer.click();
    }
    header.appendChild(saveButton);
    
    let saveButtonImg = document.createElement("img");
    saveButtonImg.alt = "Save";
    saveButtonImg.src = "assets/save_icone.png";
    saveButton.appendChild(saveButtonImg);

    /* Body */
    let pdfBody = document.createElement("div");
    pdfBody.classList.add("body");
    pdfDocument.appendChild(pdfBody);

    /* Left Column */
    let leftColumn = document.createElement("div");
    leftColumn.classList.add("menu-pdf");
    pdfBody.appendChild(leftColumn);

    /* Student & Work Data */
    let dataContainer = document.createElement("div");
    dataContainer.classList.add("menu-form");
    dataContainer.style.backgroundColor = "none";
    dataContainer.style.border = "2px solid lightgray";
    leftColumn.appendChild(dataContainer);

    /* Student */
    let studentTitle = document.createElement("h1");
    studentTitle.classList.add("menu-title");
    studentTitle.innerText = "Apprenti";
    dataContainer.appendChild(studentTitle);

    /* Name */
    let studentName = document.createElement("h1");
    studentName.classList.add("menu-subtitle");
    studentName.innerText = `Nom : ${studentNameInput.value}`;
    dataContainer.appendChild(studentName);

    /* Firstname */
    let studentFirstname = document.createElement("h1");
    studentFirstname.classList.add("menu-subtitle");
    studentFirstname.innerText = `Prénom : ${studentFirstnameInput.value}`;
    dataContainer.appendChild(studentFirstname);

    /* Formation */
    let formationTitle = document.createElement("h1");
    formationTitle.classList.add("menu-title");
    formationTitle.innerText = "Formation";
    dataContainer.appendChild(formationTitle);

    /* Formation Day */
    let formationDay = document.createElement("h1");
    formationDay.classList.add("menu-subtitle");
    let formationDaySelect = document.getElementById("formation-day-select");
    formationDay.innerText = `Jour de Formation : ${formationDaySelect.options[formationDaySelect.selectedIndex].text}`;
    dataContainer.appendChild(formationDay);

    /* Date de Début */
    let beginDate = document.createElement("h1");
    beginDate.classList.add("menu-subtitle");
    let beginDateInput = document.getElementById("dateInput");
    let strs = beginDateInput.value.split("-");
    let yearValue = strs[0];
    let monthValue = strs[1];
    let dayValue = strs[2];
    beginDate.innerText = `Date de Début : ${dayValue}/${monthValue}/${yearValue}`;
    dataContainer.appendChild(beginDate);

    /* Calendar Legend */
    let legendContainer = document.createElement("div");
    legendContainer.classList.add("menu-color-picker");
    legendContainer.style.backgroundColor = "none";
    legendContainer.style.border = "2px solid lightgray";
    leftColumn.appendChild(legendContainer);
    
    let legendTitle = document.createElement("h1");
    legendTitle.classList.add("menu-title");
    legendTitle.innerText = "Légende";
    legendContainer.appendChild(legendTitle);

    let legend = document.createElement("div");
    legend.classList.add("menu-list-colors");
    legendContainer.appendChild(legend);

    const pickers = [
        {name: "Formation", dayType: DayType.Formation, dayColor: DayColor.Formation},
        {name: "Férié", dayType: DayType.Holiday, dayColor: DayColor.Holiday},
        {name: "Fermeture", dayType: DayType.Closing, dayColor: DayColor.Closing},
        {name: "Visio", dayType: DayType.Visio, dayColor: DayColor.Visio},
        {name: "Révision", dayType: DayType.Revision, dayColor: DayColor.Revision},
        {name: "Epreuve", dayType: DayType.Exam, dayColor: DayColor.Exam},
        {name: "Intégration", dayType: DayType.Integration, dayColor: DayColor.Integration},
    ];
    pickers.forEach(element => {
        let picker = new ColorPicker(element.name, element.dayType, element.dayColor, selectedClr);
        picker.colorButton.disabled = true;
        picker.colorButton.style.cursor = "arrow";
        legend.appendChild(picker.div);
    });

    /* Corporation Stamp */
    let corpStampContainer = document.createElement("div");
    corpStampContainer.classList.add("pdf-corpstamp-container");
    leftColumn.appendChild(corpStampContainer);

    /* Stamp Box */
    let corpStampBox = document.createElement("div");
    corpStampBox.classList.add("pdf-corpstamp");
    corpStampContainer.appendChild(corpStampBox);

    /* Corporation Title */
    let corpStampTitle = document.createElement("h1");
    corpStampTitle.classList.add("pdf-corpstamp-title");
    corpStampTitle.innerText = "IDMN";
    corpStampBox.appendChild(corpStampTitle);

    /* Calendar Container */
    let calendarContainer = document.createElement("div");
    calendarContainer.classList.add("pdf-container");
    pdfBody.appendChild(calendarContainer);

    /* Calendar */
    let calendar = document.createElement("div");
    calendar.classList.add("pdf-calendar");
    calendar.id = "pdf-calendar";
    calendarContainer.appendChild(calendar);

    /* Calendar Header */
    let calendarHeader = document.createElement("div");
    calendarHeader.classList.add("calendar-header");
    calendarHeader.id = "pdf-calendar-header";
    calendar.appendChild(calendarHeader);

    let calendarTitle = document.createElement("h1");
    calendarTitle.classList.add("calendar-title");
    calendarTitle.innerText = calendarTitleTxt.innerText;
    calendarTitle.id = "pdf-calendar-title";
    calendarHeader.appendChild(calendarTitle);

    /* Calendar Body */
    let calendarBody = document.createElement("div");
    calendarBody.classList.add("calendar-body");
    calendarBody.id = "pdf-calendar-body";
    calendar.appendChild(calendarBody);

    /* Calendar Foot */
    let calendarFoot = document.createElement("div");
    calendarFoot.classList.add("calendar-feet");
    calendarFoot.id = "pdf-calendar-feet";
    calendar.appendChild(calendarFoot);

    let pdfCalendarObj = new Calendar()
    pdfCalendarObj.copy(calendarObj);
}

function createOptionCategory(body, title) {
    let listContainer = document.createElement("div");
    listContainer.classList.add("list-container");
    body.appendChild(listContainer);

    let listTitle = document.createElement("h1");
    listTitle.classList.add("list-title");
    listTitle.innerText = title;
    listContainer.appendChild(listTitle);

    let listBody = document.createElement("div");
    listBody.classList.add("list-body");
    listContainer.appendChild(listBody);

    let listAddButton = document.createElement("button");
    listAddButton.classList.add("list-button");
    listContainer.appendChild(listAddButton);

    let listAddButtonImg = document.createElement("img");
    listAddButtonImg.src = "assets/add.png";
    listAddButtonImg.alt = "Ajouter";
    listAddButton.appendChild(listAddButtonImg);

    let listFoot = document.createElement("div");
    listFoot.classList.add("list-foot");
    listContainer.appendChild(listFoot);

    return {listBody: listBody, listAddButton: listAddButton};
}

function openSettingsMenu() {
    let {container} = createDialogWindow();
    container.style.backgroundColor = "#E2E2E2";

    let spacer = document.createElement("div");
    spacer.classList.add("settings-header-spacer");
    container.appendChild(spacer);

    let header = document.createElement("div");
    header.classList.add("settings-header");
    container.appendChild(header);

    let title = document.createElement("h1");
    title.classList.add("settings-title");
    title.innerText = "Paramétrages";
    header.appendChild(title);

    let body = document.createElement("div");
    body.classList.add("settings-body");
    container.appendChild(body);

    function addElementToList(listBody, key, value, onclick) {
        let itemContainer = document.createElement("div");
        itemContainer.classList.add("list-item");
        listBody.appendChild(itemContainer);

        let itemText = document.createElement("h1");
        itemText.classList.add("list-item-text");
        itemText.innerText = (value == true) && `${key}` || `${key} - ${value}`;
        itemContainer.appendChild(itemText);

        let itemButton = document.createElement("button");
        itemButton.classList.add("list-item-button");
        itemButton.onclick = function() {
            onclick(itemContainer, key);
        }
        itemContainer.appendChild(itemButton);

        let buttonImg = document.createElement("img");
        buttonImg.src = "assets/delete.png";
        buttonImg.alt = "Supprimer";
        itemButton.appendChild(buttonImg);
    }

    /* Types de Fomation */
    let formationElements = createOptionCategory(body, "Types de Formation");
    let onDeleteFormation = function(itemContainer, key) {
        appConfig.deleteElement(appConfig.formationTypes, "formations", key);
        itemContainer.remove();
        /* Remove the deleted element from the formation type select */
        const formationTypeSelect = document.getElementById('formation-type-select');
        let options = formationTypeSelect.options;
        for (var i = 0; i < options.length; i++)
            if (options[i].value == key)
                options[i].remove();
    }
    appConfig.formationTypes.forEach(function(value, key) {
        addElementToList(formationElements.listBody, key, value, onDeleteFormation);
    });
    formationElements.listAddButton.onclick = function() {
        let {container, dialogBox} = createDialogWindow(true);
        container.style.backgroundColor = "#E2E2E2";

        let spacer = document.createElement("div");
        spacer.classList.add("settings-header-spacer");
        container.appendChild(spacer);

        let header = document.createElement("div");
        header.classList.add("settings-header");
        header.style.height = "25px";
        container.appendChild(header);

        let title = document.createElement("h1");
        title.classList.add("settings-subtitle");
        title.innerText = "NOUVELLE FORMATION";
        header.appendChild(title);

        let body = document.createElement("div");
        body.classList.add("settings-body");
        body.style.paddingLeft = "0";
        body.style.paddingRight = "0";
        body.style.display = "flex";
        body.style.flexDirection = "column";
        body.style.alignItems = "center";
        body.style.justifyItems = "center";
        container.appendChild(body);

        let inputAbr = document.createElement("input");
        inputAbr.classList.add("settings-input");
        inputAbr.placeholder = "Abréviation du nom";
        body.appendChild(inputAbr);

        let inputName = document.createElement("input");
        inputName.classList.add("settings-input");
        inputName.placeholder = "Nom complet";
        body.appendChild(inputName);

        let validateButton = document.createElement("button");
        validateButton.classList.add("settings-button");
        validateButton.innerText = "Valider";
        validateButton.disabled = true;
        validateButton.onclick = function() {
            let key = inputAbr.value;
            let value = inputName.value;
            if (appConfig.addElement(appConfig.formationTypes, "formations", key, value)) {
                /* Append the new formation type to the select */
                const formationTypeSelect = document.getElementById('formation-type-select');
                let option = document.createElement("option");
                option.value = key;
                option.text = value;
                formationTypeSelect.add(option);
                /* Append the new formation type to the settings list */
                addElementToList(formationElements.listBody, key, value, onDeleteFormation);
            }
            document.body.removeChild(dialogBox);
        }
        body.appendChild(validateButton);

        function checkInputs() {
            if (inputAbr.value != "" && inputName.value != "")
                validateButton.disabled = false;
            else
                validateButton.disabled = true;
        }

        inputAbr.oninput = checkInputs;
        inputName.oninput = checkInputs;

        let listFoot = document.createElement("div");
        listFoot.classList.add("list-foot");
        listFoot.style.height = "1px";
        container.appendChild(listFoot);
    }

    /* Jours Fériés */
    let holidayElements = createOptionCategory(body, "Jours Fériés");
    let onDeleteHoliday = function(itemContainer, key) {
        appConfig.deleteElement(appConfig.holidays, "holidays", key);
        itemContainer.remove();
    }
    appConfig.holidays.forEach(function(value, key) {
        addElementToList(holidayElements.listBody, key, value, onDeleteHoliday);
    });
    holidayElements.listAddButton.onclick = function() {
        let {container, dialogBox} = createDialogWindow(true);
        container.style.backgroundColor = "#E2E2E2";

        let spacer = document.createElement("div");
        spacer.classList.add("settings-header-spacer");
        container.appendChild(spacer);

        let header = document.createElement("div");
        header.classList.add("settings-header");
        header.style.height = "25px";
        container.appendChild(header);

        let title = document.createElement("h1");
        title.classList.add("settings-subtitle");
        title.innerText = "NOUVEAU JOUR FERIE";
        header.appendChild(title);

        let body = document.createElement("div");
        body.classList.add("settings-body");
        body.style.paddingLeft = "0";
        body.style.paddingRight = "0";
        body.style.display = "flex";
        body.style.flexDirection = "column";
        body.style.alignItems = "center";
        body.style.justifyItems = "center";
        container.appendChild(body);

        let inputDate = document.createElement("input");
        inputDate.classList.add("settings-input");
        inputDate.type = "date";
        body.appendChild(inputDate);

        let validateButton = document.createElement("button");
        validateButton.classList.add("settings-button");
        validateButton.innerText = "Valider";
        validateButton.disabled = true;
        validateButton.onclick = function() {
            let date = new Date(inputDate.value);
            let key = `${date.getDate()}/${date.getMonth() + 1}`;
            if (appConfig.addElement(appConfig.holidays, "holidays", key, true)) {
                /* Append the new formation type to the settings list */
                addElementToList(holidayElements.listBody, key, true, onDeleteHoliday);
            }
            document.body.removeChild(dialogBox);
        }
        body.appendChild(validateButton);

        function checkInputs() {
            if (inputDate.value != "")
                validateButton.disabled = false;
            else
                validateButton.disabled = true;
        }

        inputDate.oninput = checkInputs;

        let listFoot = document.createElement("div");
        listFoot.classList.add("list-foot");
        listFoot.style.height = "1px";
        container.appendChild(listFoot);
    }

    /* Jours de Fermeture */
    let closingDaysElements = createOptionCategory(body, "Jours de Fermeture");
    let onDeleteClosingDay = function(itemContainer, key) {
        appConfig.deleteElement(appConfig.closingdays, "closingdays", key);
        itemContainer.remove();
    }
    appConfig.closingdays.forEach(function(value, key) {
        addElementToList(closingDaysElements.listBody, key, value, onDeleteClosingDay);
    });
    closingDaysElements.listAddButton.onclick = function() {
        let {container, dialogBox} = createDialogWindow(true);
        container.style.backgroundColor = "#E2E2E2";

        let spacer = document.createElement("div");
        spacer.classList.add("settings-header-spacer");
        container.appendChild(spacer);

        let header = document.createElement("div");
        header.classList.add("settings-header");
        header.style.height = "25px";
        container.appendChild(header);

        let title = document.createElement("h1");
        title.classList.add("settings-subtitle");
        title.innerText = "NOUVEAU JOUR DE FERMETURE";
        header.appendChild(title);

        let body = document.createElement("div");
        body.classList.add("settings-body");
        body.style.paddingLeft = "0";
        body.style.paddingRight = "0";
        body.style.display = "flex";
        body.style.flexDirection = "column";
        body.style.alignItems = "center";
        body.style.justifyItems = "center";
        container.appendChild(body);

        let inputDate = document.createElement("input");
        inputDate.classList.add("settings-input");
        inputDate.type = "date";
        body.appendChild(inputDate);

        let validateButton = document.createElement("button");
        validateButton.classList.add("settings-button");
        validateButton.innerText = "Valider";
        validateButton.disabled = true;
        validateButton.onclick = function() {
            let date = new Date(inputDate.value);
            let key = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
            if (appConfig.addElement(appConfig.closingdays, "closingdays", key, true)) {
                /* Append the new formation type to the settings list */
                addElementToList(closingDaysElements.listBody, key, true, onDeleteClosingDay);
            }
            document.body.removeChild(dialogBox);
        }
        body.appendChild(validateButton);

        function checkInputs() {
            if (inputDate.value != "")
                validateButton.disabled = false;
            else
                validateButton.disabled = true;
        }

        inputDate.oninput = checkInputs;

        let listFoot = document.createElement("div");
        listFoot.classList.add("list-foot");
        listFoot.style.height = "1px";
        container.appendChild(listFoot);
    }
}

// Add click event handler to the generate button
let generateButton = document.getElementById('generate-button');
generateButton.disabled = true;
generateButton.addEventListener("click", function(event) {
    event.preventDefault(); // prevent form submission
    generateCalendar();
});

let dateInput = document.getElementById('dateInput');
dateInput.onchange = function() {
    generateButton.disabled = false;
    console.log("new date");
}

pdfButton.addEventListener("click", function(event) {
    event.preventDefault();
    openPDFMenu();
});

let settingsButton = document.getElementById("settings-button");
settingsButton.addEventListener("click", function(event) {
    event.preventDefault();
    openSettingsMenu();
})

// Fill color picker
const pickers = [
    {name: "Gomme", dayType: DayType.Clear, dayColor: DayColor.Clear},
    {name: "Formation", dayType: DayType.Formation, dayColor: DayColor.Formation},
    {name: "Férié", dayType: DayType.Holiday, dayColor: DayColor.Holiday},
    {name: "Fermeture", dayType: DayType.Closing, dayColor: DayColor.Closing},
    {name: "Visio", dayType: DayType.Visio, dayColor: DayColor.Visio},
    {name: "Révision", dayType: DayType.Revision, dayColor: DayColor.Revision},
    {name: "Epreuve", dayType: DayType.Exam, dayColor: DayColor.Exam},
    {name: "Intégration", dayType: DayType.Integration, dayColor: DayColor.Integration},
];
let color_picker = document.getElementById('menu-list-colors');
pickers.forEach(element => {
    let picker = new ColorPicker(element.name, element.dayType, element.dayColor, selectedClr);
    color_picker.appendChild(picker.div);
});
