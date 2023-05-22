import {Day} from "./Day.js"

class Month {
    constructor(beginMonth, beginDate, formationDay, appConfig, calendarObj, selectedClr) {
        this.beginMonth = beginMonth;
        this.div = document.createElement("div");
        this.totalHours = document.createElement("h1");
        this.formationDay = formationDay;
        this.calendarObj = calendarObj;
        this.hours = 0;
        if (beginDate != null)
            this.generate(beginDate, appConfig, selectedClr);
    }

    updateHours(hours) {
        let lasthours = this.hours;
        this.hours += hours;
        this.totalHours.innerText = `${this.hours}`;
        this.calendarObj.updateHours(this.hours - lasthours);
    }

    generate(beginDate, appConfig, selectedClr) {
        let monthName = Month.translateMonthToFrench(this.beginMonth.getMonth());

        // Month "widget"
        this.div.classList.add(`month-container`);

        // Month header
        this.monthHeader = document.createElement("h1");
        this.monthHeader.classList.add(`month-header`);
        this.monthHeader.innerText = monthName;
        this.div.appendChild(this.monthHeader);

        // Month days container
        let monthDays = document.createElement("div");
        monthDays.classList.add(`month-days`);
        this.div.appendChild(monthDays);

        const curMonth = this.beginMonth.getMonth();
        this.nbSpacers = 0;

        // Create Day "Widgets"
        this.days = new Array(31);
        for (let y = 0; y < 31; y++) {
            let dayWidget = new Day(this.beginMonth, selectedClr, this);
            monthDays.appendChild(dayWidget.div);
            const dateStr = `${this.beginMonth.getDate()}/${this.beginMonth.getMonth() + 1}`;
            if (appConfig.holidays.has(dateStr)) {
                dayWidget.setHoliday();
            } else if (appConfig.closingdays.has(dateStr)) {
                dayWidget.setClosingDay();
            } else if (beginDate <= this.beginMonth && this.formationDay == this.beginMonth.getDay()) {
                if (this.calendarObj.integration < 2) {
                    dayWidget.setIntegrationDay();
                    this.calendarObj.integration += 1;
                } else {
                    dayWidget.setFormationDay();
                }
            }
            this.days[y] = dayWidget;
            this.beginMonth.setDate(this.beginMonth.getDate() + 1);
            if (curMonth != this.beginMonth.getMonth()) {
                dayWidget.setLastDay();
                this.nbSpacers = (31 - y);
                break;
            }
        }

        // Add spacers before month total hours
        for (let y = 0; y < this.nbSpacers; y++) {
            let spacer = document.createElement(`div`);
            spacer.classList.add(`day-container`);
            spacer.style.border = "1px solid white";
            monthDays.appendChild(spacer);
        }

        // Add total hours
        let totalContainer = document.createElement("div");
        totalContainer.classList.add(`month-hours`);
        this.totalHours.classList.add(`month-hours-text`);
        totalContainer.appendChild(this.totalHours);
        monthDays.appendChild(totalContainer);
    }

    copy(calendarObj, monthWidget) {
        this.calendarObj = calendarObj;
        let monthName = monthWidget.monthHeader.innerText;

        // Month "widget"
        this.div.classList.add(`month-container`);

        // Month header
        this.monthHeader = document.createElement("h1");
        this.monthHeader.classList.add(`month-header`);
        this.monthHeader.innerText = monthName;
        this.div.appendChild(this.monthHeader);

        // Month days container
        let monthDays = document.createElement("div");
        monthDays.classList.add(`month-days`);
        this.div.appendChild(monthDays);

        // Copy Day "Widgets"
        let thisMonth = this;
        monthWidget.days.forEach((dayWidget) => {
            let dayCopy = new Day();
            dayCopy.copy(thisMonth, dayWidget);
            monthDays.appendChild(dayCopy.div);
        });

        // Add spacers before month total hours
        for (let y = 0; y < monthWidget.nbSpacers; y++) {
            let spacer = document.createElement(`div`);
            spacer.classList.add(`day-container`);
            spacer.style.border = "1px solid white";
            monthDays.appendChild(spacer);
        }

        // Add total hours
        let totalContainer = document.createElement("div");
        totalContainer.classList.add(`month-hours`);
        this.totalHours.classList.add(`month-hours-text`);
        totalContainer.appendChild(this.totalHours);
        monthDays.appendChild(totalContainer);
    }

    static frenchMonths = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
    static translateMonthToFrench(monthID){
        let name = "Inconnu";
        if (monthID >= 0 || monthID < 12) {
            name = this.frenchMonths[monthID];
        }
        return (name);
    }
}

export default Month;
