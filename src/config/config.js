const fs = require("fs");

class Config {
    constructor() {
        // Formation Days
        this.readJSONFile("./config/days.json", function(config, data) {
            config.formationDays = [];
            const formationDaySelect = document.getElementById('formation-day-select');
            for (const item of data) {
                const optionElement = document.createElement('option');
                optionElement.value = item.value;
                optionElement.text = item.text;
                formationDaySelect.add(optionElement);
                config.formationDays[item.value] = item.text;
            }
        });
        // Formation Types
        this.readJSONFile("./config/formations.json", function(config, data) {
            config.formationTypes = new Map(Object.entries(data));
            /* Fill formation type dropdown menu */
            const formationTypeSelect = document.getElementById('formation-type-select');
            config.formationTypes.forEach(function(value, key) {
                const optionElement = document.createElement('option');
                optionElement.value = key;
                optionElement.text = value;
                formationTypeSelect.add(optionElement);
            });
        });
        // Holidays
        this.readJSONFile("./config/holidays.json", function(config, data) {
            config.holidays = new Map(Object.entries(data));
        });
        // Closing Days
        this.readJSONFile("./config/closingdays.json", function(config, data) {
            config.closingdays = new Map(Object.entries(data));
        });
    }

    readJSONFile(path, callback) {
        fetch(path)
        .then(response => response.json())
        .then(data => {
            callback(this, data);
        })
        .catch(error => console.error(error));
    }

    saveMapToJSONFile(map, mapname) {
        const path = `config/${mapname}.json`;
        fs.exists(path, function(exists) {
            if (exists) {
                var obj = Object.fromEntries(map);
                var str = JSON.stringify(obj);
                fs.writeFileSync(`config/${mapname}.json`, str);
            } else
                console.error("saveMapToJSONFile", map, mapname);
        });
    }

    deleteElement(map, mapname, key) {
        if (map.has(key)) {
            map.delete(key);
            this.saveMapToJSONFile(map, mapname);
        }
    }

    addElement(map, mapname, key, value) {
        if (!map.has(key)) {
            map.set(key, value);
            this.saveMapToJSONFile(map, mapname);
            return (true);
        }
        return (false);
    }
}

export default Config;
