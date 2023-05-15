import Month from "./Month.js"

export class Calendar {
    constructor() {}

    updateHours(hours) {
        this.hours += hours;
        this.calendarTotalHoursText.innerText = `${this.hours}`;
    }

    generate(maxMonth, beginMonth, beginDate, formationDay, appConfig, selectedClr) {
        this.integration = 0;
        this.hours = 0;
        this.calendarBody = document.getElementById('calendar-body');
        this.calendarFeet = document.getElementById('calendar-feet');

        // Clear Calendar
        this.clearCalendar();

        // Create Feet Calendar
        this.createFeet();

        // Create Month "Widgets"
        this.months = new Array(maxMonth);
        for (let i = 0; i < maxMonth; i++) {
            let monthWidget = new Month(beginMonth, beginDate, formationDay, appConfig, this, selectedClr);
            this.calendarBody.appendChild(monthWidget.div);
            this.months[i] = monthWidget;
        }
    }

    copy(calendarObj) {
        this.integration = 0;
        this.hours = 0;
        this.calendarBody = document.getElementById('pdf-calendar-body');
        this.calendarFeet = document.getElementById('pdf-calendar-feet');

        // Clear Calendar
        this.clearCalendar();

        // Create Feet Calendar
        this.createFeet();

        let thisCalendar = this;
        calendarObj.months.forEach((monthWidget) => {
            let monthCopy = new Month();
            monthCopy.copy(thisCalendar, monthWidget);
            this.calendarBody.appendChild(monthCopy.div);
        });
    }

    clearCalendar() {
        while (this.calendarBody.firstChild) {
            this.calendarBody.removeChild(this.calendarBody.lastChild);
        }
        while (this.calendarFeet.firstChild) {
            this.calendarFeet.removeChild(this.calendarFeet.lastChild);
        }
    }

    createFeet() {
        let calendarTotalHours = document.createElement('div');
        calendarTotalHours.classList.add(`calendar-feet-total`);
        this.calendarTotalHoursText = document.createElement('h1');
        this.calendarTotalHoursText.classList.add(`calendar-feet-total-text`);
        this.calendarTotalHoursText.innerText = "0";
        calendarTotalHours.appendChild(this.calendarTotalHoursText);
        this.calendarFeet.appendChild(calendarTotalHours);
    }
}
