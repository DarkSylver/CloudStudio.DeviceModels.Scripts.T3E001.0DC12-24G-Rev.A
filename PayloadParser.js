function parseUplink(device, payload)
{
    // Obtener payload como JSON
    const jsonPayload = payload.asJsonObject();
    Object.keys(jsonPayload).forEach(function(key){
        env.log(key,jsonPayload[key])
    })

    // No se puede deserializar el payload como json, salir.
    if (!jsonPayload) { return; }

    // Verificar que la dirección del dispositivo sea la correcta
    //if (jsonPayload.deviceAddress.toString() !== device.address.toString()) {
       // env.log('Invalid device address');
       // return;
    

    // Actualizar estado de las baterías
    if (jsonPayload.voltage){
    env.log("Variable voltage encontrada: ",jsonPayload.voltage);
    let cortar = jsonPayload.voltage.split(' ');
    var data = cortar[0];
    env.log("Voltage---> ",data);
    device.updateDeviceBattery({ voltage: data });


    }
    if (jsonPayload.battery) 
    {
        const batteries = [];
        for (var [key, value] of Object.entries(jsonPayload.battery))
        {
        //env.log('Valor KEY: ', key "  ", "y VALUE:  " value);
            if (key=="voltage")
                {
                    env.log("Variable BAT encontrada: ",key);
                    let cortar = value.split(' ');
                    var data = cortar[0];
                    env.log(data);
                    
                }
            batteries.push({type: batteryType[key], voltage: data});
            env.log("Push -> ", key, "  Push-->:", data);          
        }
        device.updateDeviceBattery(batteries);
    }
    // Actualizar RSSI
    if (jsonPayload.strength) {
    env.log("Variable strength encontrada: ",jsonPayload.strength);
    let cortar2 = jsonPayload.strength.split(' ');
    var data2 = cortar2[0];
    env.log("rssi--->",data2);
    device.updateDeviceRssi({ strength: data2 });
    }
    if (jsonPayload.rssi) {
        const rssi = [];
        for (var [key, value] of Object.entries(jsonPayload.rssi))
         {
            env.log('Valor KEY: ', key, "  ", "y VALUE:  " ,value);
            if (key=="strength")
                {
                    env.log("Variable strength encontrada: ",key);
                    let cortar2 = value.split(' ');
                    var data2 = cortar2[0];
                    env.log(data2);
                    
                }
            rssi.push({type: rssiType[key], quality: data2});
            env.log("Push -> ", key, "Push-->:", data2); 
        }
        device.updateDeviceRssi(rssi);
    }
    // Parsear y almacenar la temperatura
    if (jsonPayload.rawData) {
        var temperatureSensor = device.endpoints.byAddress(1);
        let temp = jsonPayload.rawData;
        
        env.log("Temperatura--->",temp);
        //let cortar3 =temp.split(']');
        //let cortar4=cortar3[0].split('[');
        //let dato3 = cortar4[1];
        //env.log("Cortar 4------->"dato3);
        let aux = temp.split(',');
        env.log("TEMP  ",aux[1]);
        let aux2 = (aux[1]/100);
        env.log("TEMP  ",aux2);
        //temperatureSensor.updateTemperatureSensorStatus(dato3);
        temperatureSensor.updateTemperatureSensorStatus(aux2);
    }

     // Parsear y almacenar la temperatura 2
    if (jsonPayload.bodyRaw) {
        var temperatureSensor = device.endpoints.byAddress(1);
        let temp = jsonPayload.bodyRaw;
        env.log("Json--->",temp);
        let aux = temp.split('"');
        env.log("split--->",aux[9]);
        let aux2 = aux[9];
        let aux3 = aux2.split(',');
        env.log("TEMP parcial  ",aux3[1]);
        let aux4 = (aux3[1]/100);
        env.log("TEMP  ",aux4);
        temperatureSensor.updateTemperatureSensorStatus(aux4);
    }
    


}

