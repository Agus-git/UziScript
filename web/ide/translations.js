
var TRANSLATIONS = [
    // spec
    ["en", "es", "et"],

    ["New...", "Nuevo...", "Uus..."],
    ["Open...", "Abrir...", "Ava..."],
    ["Save...", "Guardar...", "Salvesta..."],
    ["Automatic", "Automático", "Automaatne"],
    ["Other...", "Otro...", "Muu..."],
    ["Connect", "Conectar", "Ühenda"],
    ["Disconnect", "Desconectar", "Ühenda lahti"],
    ["Verify", "Verificar", "Kontrolli"],
    ["Run", "Ejecutar", "Jooksuta"],
    ["Install", "Instalar", "Paigalda"],
    ["Debug", "Depurar", "Silu"],
    ["Interactive mode", "Modo interactivo", "Interaktiivne"],
    ["Options...", "Opciones...", "Seaded..."],
    ["Pins", "Pines", "Viigud"],
    ["* no values reporting *", "* no hay datos *", "* väärtusi pole *"],
    ["Globals", "Variables globales", "Globaalsed muutujad"],
    ["Tasks", "Tareas", "Tööd"],
    ["ERROR: Broken layout", "ERROR: Diseño arruinado", "VIGA: Katkine asetus"],
    ["It seems you've broken the page layout.", "Parece que se rompió el diseño de la aplicación.", "Paistab, et sa oled asetuse lõhkunud."],
    ["But don't worry! Click the button below to restore it to its former glory.", "¡Pero no te preocupes! Hacé clic en el botón siguiente para restaurarlo.", "Aga ära pabista! Vajuta nupule, et taastada õige seis."],
    ["Restore default layout", "Restaurar diseño", "Taasta vaikimisi asetus"],
    ["ERROR: Server not found", "ERROR: Servidor no encontrado", "VIGA: Serverit ei leitud"],
    ["Please make sure the Physical BITS server is up and running.", "Por favor, asegurate de que el servidor de Physical BITS está ejecutándose.", "Palun tee kindlaks, et Physical BITS server on püsti."],
    ["Attempting to reconnect...", "Intentando volver a conectarse...", "Püüan uuesti ühenduda..."],
    ["Options", "Opciones", "Seaded"],
    ["User interface", "Interfaz de usuario", "Kasutajaliides"],
    ["Internationalization", "Internacionalización", "Keeled"],
    ["Panels:", "Paneles:", "Paanid:"],
    ["Inspector", "Inspector", "Inspektor"],
    ["Output", "Salida", "Väljund"],
    ["Blocks", "Bloques", "Klotsid"],
    ["Serial Monitor", "Monitor Serial", "Jadapordi monitor"],
    ["Code", "Código", "Kood"],
    ["Debugger", "Depurador", "Siluja"],
    ["Current language:", "Idioma actual:", "Keel:"],
    ["Choose pins", "Elegir pines", "Vali viigud"],
    ["Choose globals", "Elegir variables globales", "Vali globaalsed muutujad"],
    ["Configure motors", "Configurar motores", "Seadista mootorid"],
    ["Motor name", "Nombre del motor", "Mootori nimi"],
    ["Enable pin", "Pin Enable", "Ava viik"],
    ["Forward pin", "Pin Forward", "Ettepoole viik"],
    ["Backward pin", "Pin Backward", "Tahapoole viik"],
    ["Configure sonars", "Configurar sonares", "Seadista kajalood"],
    ["Sonar name", "Nombre del sonar", "Kajaloo nimi"],
    ["Trig pin", "Pin Trig", "Kõlari viik"],
    ["Echo pin", "Pin Echo", "Kaja (mikrofoni) viik"],
    ["Max distance (cm)", "Distancia máxima (cm)", "Pikim kaugus (cm)"],
    ["This variable is being used by the program!", "¡Esta variable está siendo usada en el programa!", "Seda muutujat kasutatakse programmis!"],
    ["This motor is being used by the program!", "¡Este motor está siendo usado en el programa!", "Seda mootorit kasutatakse programmis!"],
    ["This sonar is being used by the program!", "¡Este sonar está siendo usado en el programa!", "Seda kajaloodi kasutatakse programmis!"],

    // Blockly
    ["toggle pin", "alternar pin", "lülita viik ümber"],
    ["pin %1", "pin %1", "viik %1"],
    ["wait", "esperar", "oota"],
    ["is %1 pin", "está %1 el pin", "on viik %1"],
    ["read pin", "leer pin", "loe viik"],
    ["write pin %1 value %2", "escribir en el pin %1 el valor %2", "kirjuta viigu %1 väärtuseks %2"],
    ["repeat forever", "repetir por siempre", "korda igavesti"],
    ["elapsed %1", "%1 transcurridos", "%1 on möödunud"],
    ["move servo on pin %1 degrees %2", "mover servo en pin %1 grados %2", "pööra viigus %1 servot %2 kraadi"],
    ["repeat", "repetir", "korda"],
    ["repeat % times", "repetir % veces", "korda % korda"],
    ["count with % from % to % by %", "contar con % desde % hasta % por %", "loenda % kuni % sammuga %"],
    ["timer named % running % times per % initial state %", "temporizador llamado % ejecutándose % veces por % estado inicial %", "kell nimega % tiksub % korda iga % algseis %"],
    ["task named", "tarea llamada", "ülesanne nimega"],
    ["if % then %", "si % entonces %", "juhul kui %, siis %"],
    ["if % then % else %", "si % entonces % si no %", "juhul kui %, siis %, muidu %"],
    ["stop", "detener", "peata"],
    ["start", "iniciar", "start"],
    ["resume", "continuar", "jätka"],
    ["pause", "pausar", "paus"],
    ["run", "ejecutar", "käivita"],
    ["turn on", "encender", "lülita sisse"],
    ["turn off", "apagar", "lülita välja"],
    ["on", "encendido", "sees"],
    ["off", "apagado", "väljas"],
    ["milliseconds", "milisegundos", "millisekundit"],
    ["seconds", "segundos", "sekundit"],
    ["minutes", "minutos", "minutit"],
    ["second", "segundo", "sekund"],
    ["minute", "minute", "minut"],
    ["hour", "hour", "tund"],
    ["started", "iniciado", "käivitatud"],
    ["stopped", "detenido", "peatatud"],
    ["move %% at speed", "mover % hacia % a velocidad", "liigu %% kiirusega"],
    ["set % speed to", "fijar velocidad de % a", "vali % kiirus"],
    ["read distance from % in %", "leer distancia de % en %", "mõõda kaugust %-st % ühikutes"],
    ["forward", "adelante", "edasi"],
    ["backward", "atrás", "tagasi"],
    ["mm", "mm", "mm"],
    ["cm", "cm", "cm"],
    ["m", "m", "m"],
    ["while", "mientras que", "senikaua"],
    ["until", "hasta que", "kuni"],
    ["true", "verdadero", "tõene"],
    ["false", "falso", "väär"],
    ["and", "y", "ja"],
    ["or", "o", "või"],
    ["not", "no", "mitte"],
    ["is even", "es par", "on paaris"],
    ["is odd", "es impar", "on paaritu"],
    ["is prime", "es primo", "on algarv"],
    ["is whole", "es entero", "on täisarv"],
    ["is positive", "es positivo", "on positiivne"],
    ["is negative", "es negativo", "on negatiivne"],
    ["is divisible by", "es divisible por", "jaguneb arvuga"],
    ["Tasks", "Tareas", "Tööd"],
    ["GPIO", "GPIO", "GPIO"],
    ["Motors", "Motores", "Mootorid"],
    ["Servo", "Servo", "Servo"],
    ["DC", "CC", "DC"],
    ["Sensors", "Sensores", "Andurid"],
    ["Sonar", "Sonar", "Kajalood"],
    ["Control", "Control", "Kontroll"],
    ["Math", "Matemática", "Aritmeetika"],
    ["Variables", "Variables", "Muutujad"],
    ["Functions", "Funciones", "Funktsioonid"],
    ["Comments", "Comentarios", "Kommentaarid"],
    ["Procedures", "Procedimientos", "Procedures"],
    ["Configure DC motors...", "Configurar motores CC...", "Seadista mootorid..."],
    ["Configure sonars...", "Configurar sonares...", "Seadista kajalood..."],
    ["random integer from %1 to %2", "número entero al azar entre %1 y %2", "suvaline täisarv %1 ja %2 vahel"],
    ["constrain %1 low %2 high %3", "mantener %1 entre %2 y %3", "piira %1 olema %2 ja %3 vahel"],
    ["random fraction", "fracción al azar", "suvaline murdarv"],
    ["square root", "raíz cuadrada", "ruutjuur"],
    ["absolute", "valor absoluto", "absoluutarv"],
    ["-", "-", "-"],
    ["ln", "ln", "ln"],
    ["log10", "log10", "log10"],
    ["e^", "e^", "e^"],
    ["10^", "10^", "10^"],
    ["sin", "seno", "sin"],
    ["cos", "coseno", "cos"],
    ["tan", "tangente", "tan"],
    ["asin", "arcoseno", "asin"],
    ["acos", "arcocoseno", "acos"],
    ["atan", "arcotangente", "atan"],
    ["round", "redondear", "ümardamine"],
    ["round up", "redondear hacia arriba", "ümarda üles"],
    ["round down", "redondear hacia abajo", "ümarda alla"],
    ["remainder of % ÷ %", "resto de % ÷ %", "% ÷ % jääk"],
    ["Configure variables...", "Configurar variables...","Seadista muutujaid..."],
    ["Configure variables", "Configurar variables", "Seadista muutujaid"],
    ["Variable name", "Nombre de variable", "Muutuja nimi"],
    ["declare local variable % with value", "declarar variable local % con valor", "määra muutuja % väärtusega"],
    ["set % to", "establecer % a", "määra % väärtusega"],
    ["increment % by", "incrementar % por", "kasvata % suurusega"],
    ["procedure named % with arguments %", "procedimiento llamado % con argumentos %", "procedure named % with arguments %"],
    ["procedure named %", "procedimiento llamado %", "procedure named %"],
    ["procedure named % with argument %", "procedimiento llamado % con argumento %", "procedure named % with argument %"],
    ["exit", "salir", "exit"],
    ["execute", "ejecutar", "execute"],
    ["function named % with arguments %", "función llamada % con argumentos %", "function named % with arguments %"],
    ["function named %", "función llamada %", "function named %"],
    ["function named % with argument %", "función llamada % con argumento %", "function named % with argument %"],
    ["return", "devolver", "return"],
    ["evaluate", "evaluar", "evaluate"],
];
