const fs = require("fs");

class Config {
    constructor() {
        // Fill default values
        this.defaultValues = new Map([
            ["./config/days.json", `[{"value": 1, "text": "Lundi"},{"value": 2, "text": "Mardi"},{"value": 3, "text": "Mercredi"},{"value": 4, "text": "Jeudi"},{"value": 5, "text": "Vendredi"}]`],
            ["./config/closingdays.json", `{"7/8/2023":true,"8/8/2023":true,"9/8/2023":true,"10/8/2023":true,"11/8/2023":true,"12/8/2023":true,"13/8/2023":true,"14/8/2023":true,"16/8/2023":true,"17/8/2023":true,"18/8/2023":true,"26/12/2023":true,"27/12/2023":true,"28/12/2023":true,"29/12/2023":true}`],
            ["./config/formations.json", `{"MUM":"Manager d'Unité Marchande","CPEB":"Chef de Projet E-Business","CC":"Conseiller Commercial","MA":"Manage d'Affaires","CUI":"Cuisinier","SER":"Serveur en Restauration","AMUM":"Assistant Manager d'Unité Marchande","CV":"Conseil de Vente","NTC":"Négociateur Technico Commercial","AR":"Agent de Restauration","EC":"Employé Commercial","AC":"Assistant Commercial","RH":"Réceptionniste en Hotellerie"}`],
            ["./config/holidays.json", `{"1/1":true,"9/4":true,"10/4":true,"1/5":true,"8/5":true,"18/5":true,"29/5":true,"14/7":true,"15/8":true,"1/11":true,"11/11":true,"25/12":true,"31/12":true}`],
        ]);

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
        .catch(error => {
            console.error(error);
            console.log(`Config init: ${path}`);
            let conf = this;
            fs.writeFile(`src/${path}`, this.defaultValues.get(path), function(err) {
                if(err)
                    alert(err);
                else {
                    console.log(`Config initialized: ${path}`);
                    conf.readJSONFile(path, callback);
                }
            });
        });
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
