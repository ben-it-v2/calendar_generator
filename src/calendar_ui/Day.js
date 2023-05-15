export const DayColor = {
    None: "#FFFFFF",
	Clear: "#FFFFFF",
	Formation: "#bd95ba",
	Closing: "#c99b95",
	Holiday: "#9ea7a8",
	Visio: "#a9c995",
	Revision: "#7a7ede",
	Exam: "#6b4770",
	WeekEnd: "#cae1e4",
	Integration: "#f2c1ef"
};

export const DayType = {
    None: 0,
	Clear: 1,
	Formation: 2,
	Closing: 3,
	Holiday: 4,
	Visio: 5,
	Revision: 6,
	Exam: 7,
	WeekEnd: 8,
	Integration: 9
};

export class Day {
    constructor(beginMonth, selectedClr, monthObj) {
        this.beginMonth = beginMonth;
        this.div = document.createElement("div");
        this.letter = document.createElement("h1");
        this.id = document.createElement("h1");
        this.tag = document.createElement("h1");
        this.selectedClr = selectedClr;
        this.type = DayType.None;
        this.hour = 0;
        this.monthObj = monthObj;
        if (beginMonth != null)
            this.generate();
    }

    generate() {
        this.div.classList.add(`day-container`);
        const cDay = this;
        this.div.addEventListener("click", function() {
            cDay.onClick();
        });

        // Day letter
        this.letter.classList.add(`day-letter`);
        this.letter.innerText = Day.formatDayName(this.beginMonth.getDay());
        this.div.appendChild(this.letter);

        if (this.letter.innerText == "D" || this.letter.innerText == "S") {
            this.setWeekEnd();
        }

        // Day number
        this.id.classList.add(`day-number`);
        this.id.innerText = `${this.beginMonth.getDate()}`;
        this.div.appendChild(this.id);

        // Day tag
        this.tag.classList.add(`day-tag`);
        this.div.appendChild(this.tag);
    }

    copy(monthObj, dayWidget) {
        this.monthObj = monthObj;
        this.div.classList.add(`day-container`);

        // Day letter
        this.letter.classList.add(`day-letter`);
        this.letter.innerText = dayWidget.letter.innerText;
        this.div.appendChild(this.letter);

        if (this.letter.innerText == "D" || this.letter.innerText == "S") {
            this.setWeekEnd();
        }

        // Day number
        this.id.classList.add(`day-number`);
        this.id.innerText = dayWidget.id.innerText;
        this.div.appendChild(this.id);

        // Day tag
        this.tag.classList.add(`day-tag`);
        this.div.appendChild(this.tag);

        this.setType(dayWidget.type);
    }

    setLastDay() {
        this.div.style.borderBottomLeftRadius = "5px";
        this.div.style.borderBottomRightRadius = "5px";
    }

    updateBackgroundColor(color) {
        this.div.style.backgroundColor = color;
    }

    updateTextColor(color) {
        this.letter.style.color = color;
        this.id.style.color = color;
        this.tag.style.color = color;
    }

    updateHour(hour) {
        let lasthour = this.hour;
        this.hour = hour;
        this.monthObj.updateHours(hour - lasthour);
    }

    setFormationDay() {
        this.updateBackgroundColor(DayColor.Formation);
        this.updateTextColor("black");
        this.tag.innerText = "";
        this.type = DayType.Formation;
        this.updateHour(7);
    }

    clearDay() {
        this.updateBackgroundColor(DayColor.Clear);
        this.updateTextColor("black");
        this.tag.innerText = "";
        this.type = DayType.Clear;
        this.updateHour(0);
    }

    setClosingDay() {
        this.updateBackgroundColor(DayColor.Closing);
        this.updateTextColor("black");
        this.tag.innerText = "";
        this.type = DayType.Closing;
        this.updateHour(0);
    }

    setHoliday() {
        this.updateBackgroundColor(DayColor.Holiday);
        this.updateTextColor("black");
        this.tag.innerText = "FÉRIÉ";
        this.type = DayType.Holiday;
        this.updateHour(0);
    }

    setVisioDay() {
        this.updateBackgroundColor(DayColor.Visio);
        this.updateTextColor("black");
        this.tag.innerText = "";
        this.type = DayType.Visio;
        this.updateHour(4);
    }

    setRevisionDay() {
        this.updateBackgroundColor(DayColor.Revision);
        this.updateTextColor("black");
        this.tag.innerText = "";
        this.type = DayType.Revision;
        this.updateHour(7);
    }

    setExamDay() {
        this.updateBackgroundColor(DayColor.Exam);
        this.updateTextColor("white");
        this.tag.innerText = "";
        this.type = DayType.Exam;
        this.updateHour(7);
    }

    setWeekEnd() {
        this.updateBackgroundColor(DayColor.WeekEnd);
        this.updateTextColor("black");
        this.tag.innerText = "";
        this.type = DayType.WeekEnd;
        this.updateHour(0);
    }

    setIntegrationDay() {
        this.updateBackgroundColor(DayColor.Integration);
        this.updateTextColor("black");
        this.tag.innerText = "";
        this.type = DayType.Integration;
        this.updateHour(7);
    }

    setType(type) {
        if (this.type != DayType.WeekEnd) {
            switch (type) {
                case DayType.Clear:
                    this.clearDay();
                    break;
                case DayType.Formation:
                    this.setFormationDay();
                    break;
                case DayType.Closing:
                    this.setClosingDay();
                    break;
                case DayType.Holiday:
                    this.setHoliday();
                    break;
                case DayType.Visio:
                    this.setVisioDay();
                    break;
                case DayType.Revision:
                    this.setRevisionDay();
                    break;
                case DayType.Exam:
                    this.setExamDay();
                    break;
                case DayType.Integration:
                    this.setIntegrationDay();
                    break;
            }
        }
    }

    onClick() {
        this.setType(this.selectedClr.color);
    }

    static formatDayName(dayID) {
        let dayName = "NULL";
        switch (dayID) {
            case 0:
                dayName = "D";
                break;
            case 1:
                dayName = "L";
                break;
            case 2:
                dayName = "M";
                break;
            case 3:
                dayName = "M";
                break;
            case 4:
                dayName = "J";
                break;
            case 5:
                dayName = "V";
                break;
            case 6:
                dayName = "S";
                break;
        }
        return (dayName);
    }
}
