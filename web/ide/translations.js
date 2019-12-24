
var TRANSLATIONS = [
    // spec
    ["en", "es", "et", "se"],

    ["New...", "Nuevo...", "Uus...", "Ny..."],
    ["Open...", "Abrir...", "Ava...", "Öppna..."],
    ["Save...", "Guardar...", "Salvesta...", "Spara..."],
    ["Automatic", "Automático", "Automaatne", "Automatisk"],
    ["Other...", "Otro...", "Muu...", "Annan..."],
    ["Connect", "Conectar", "Ühenda", "Anslut"],
    ["Disconnect", "Desconectar", "Ühenda lahti", "Koppla ifrån"],
    ["Verify", "Verificar", "Kontrolli", "Kontrollera"],
    ["Run", "Ejecutar", "Jooksuta", "Kör"],
    ["Install", "Instalar", "Paigalda", "Installera"],
    ["Debug", "Depurar", "Silu", "Debug"],
    ["Interactive mode", "Modo interactivo", "Interaktiivne", "Interaktiv"],
    ["Options...", "Opciones...", "Seaded...", "Inställningar..."],
    ["Pins", "Pines", "Viigud", "Ben"],
    ["* no values reporting *", "* no hay datos *", "* väärtusi ei edastata *", "* ingen värden rapporteras *"],
    ["Globals", "Variables globales", "Globaalsed muutujad", "Globala variabler"],
    ["Tasks", "Tareas", "Tööd", "Jobb"],
    ["ERROR: Broken layout", "ERROR: Diseño arruinado", "VIGA: Katkine asetus", "FEL: bruten layout"],
    ["It seems you've broken the page layout.", "Parece que se rompió el diseño de la aplicación.", "Paistab, et sa oled asetuse lõhkunud.", "Det verkar som något gått fel med layouten"],
    ["But don't worry! Click the button below to restore it to its former glory.", "¡Pero no te preocupes! Hacé clic en el botón siguiente para restaurarlo.", "Aga ära pabista! Vajuta nupule, et taastada õige seis.", "Men oroa dig inte! Klicka på knappen nedan för att återställa den till sin tidigare härlighet."],
    ["Restore default layout", "Restaurar diseño", "Taasta vaikimisi asetus", "Återställ layout"],
    ["ERROR: Server not found", "ERROR: Servidor no encontrado", "VIGA: Serverit ei leitud", "FEL: Servern kunde inte nås"],
    ["Please make sure the Physical BITS server is up and running.", "Por favor, asegurate de que el servidor de Physical BITS está ejecutándose.", "Palun tee kindlaks, et Physical BITS server on püsti.", "Se till att Physical BITS-servern är igång."],
    ["Attempting to reconnect...", "Intentando volver a conectarse...", "Püüan uuesti ühenduda...", "Försöker återansluta..."],
    ["Options", "Opciones", "Seaded", "Alternativ"],
    ["User interface", "Interfaz de usuario", "Kasutajaliides", "Användargränssnitt"],
    ["Internationalization", "Internacionalización", "Keeled", "Språk"],
    ["Panels:", "Paneles:", "Paanid:", "Paneler:"],
    ["Inspector", "Inspector", "Inspektor", "Inspektör"],
    ["Output", "Salida", "Väljund", "Utdata"],
    ["Blocks", "Bloques", "Klotsid", "Klossar"],
    ["Serial Monitor", "Monitor Serial", "Jadapordi monitor", "Serieport monitor"],
    ["Code", "Código", "Kood", "Kod"],
    ["Debugger", "Depurador", "Siluja", "Debugger"],
    ["Current language:", "Idioma actual:", "Keel:", "Valt språk:"],
    ["Choose pins", "Elegir pines", "Vali viigud", "Välj ben"],
    ["Choose globals", "Elegir variables globales", "Vali globaalsed muutujad", "Välj variabler"],
    ["Configure motors", "Configurar motores", "Seadista mootorid", "Konfigurera motorer"],
    ["Motor name", "Nombre del motor", "Mootori nimi", "Motorns namn"],
    ["Enable pin", "Pin Enable", "Sisselülituse viik", "Påslagningsben"],
    ["Forward pin", "Pin Forward", "Viik ettepoole pööramiseks", "Ben för att rotera framåt"],
    ["Backward pin", "Pin Backward", "Viik tahapoole pööramiseks", "Ben för att rotera bakåt"],
    ["Configure sonars", "Configurar sonares", "Seadista kajalood", "Konfigurera ekolod"],
    ["Sonar name", "Nombre del sonar", "Kajaloo nimi", "Ekolodets namn"],
    ["Trig pin", "Pin Trig", "Kõlari viik", "Högtalarens ben"],
    ["Echo pin", "Pin Echo", "Kaja (mikrofoni) viik", "Mikrofonens ben"],
    ["Max distance (cm)", "Distancia máxima (cm)", "Pikim kaugus (cm)", "Längsta avstånd (cm)"],
    ["This variable is being used by the program!", "¡Esta variable está siendo usada en el programa!", "Hetkel kasutatakse seda muutujat mujal programmis!", "Denna variabel används just nu i programmet!"],
    ["This motor is being used by the program!", "¡Este motor está siendo usado en el programa!", "Hetkel kasutatakse seda mootorit mujal programmis!", "Denna motor används just nu i programmet!"],
    ["This sonar is being used by the program!", "¡Este sonar está siendo usado en el programa!", "Hetkel kasutatakse seda kajaloodi mujal programmis!", "Detta ekolod används just nu i programmet!"],

    // Server
    ["Program size (bytes): %1", "Tamaño del programa (en bytes): %1", "Programmi suurus (baitides): %1", "Programmstorlek i bytes: %1"],
    ["Compilation successful!", "¡Compilación exitosa!", "Kompileerimine õnnestus!", "Kompileringen lyckades!"],
    ["Connecting on serial...", "Conectando por serie...", "Ühendatakse jadapordiga...", "Ansluter till serieporten..."],
    ["Connecting on socket...", "Conectando por socket...", "Ühendatakse kiibipesaga...", "Ansluter till serieuttag..."],
    ["Installed program successfully!", "¡Programa instalado correctamente!", "Programmi installimine õnnestus!", "Programmet installerad!"],
    ["Opening port: %1", "Abriendo puerto: %1", "Avatakse jadaporti: %1", "Öppnar serieport: %1"],
    ["Opening port failed!", "¡La apertura del puerto falló!", "Jadapordi avamine nurjus!", "Serieporten kunde inte öppnas!"],
    ["Connection lost!", "¡Conexión perdida!", "Ühendus katkes!", "Anslutningen bröts!"],
    ["%1 detected. The program has been stopped.", "Se detectó %1. El programa ha sido detenido.", "%1 avastatud. Programm on peatatud.", "%1 hittades. Programmet har stoppats."],
    ["Free Arduino RAM: %1 bytes", "RAM de Arduino disponible: %1 bytes", "Vaba muutmälu Arduinos: %1 baiti", "Ledigt Arduino RAM-minne: %1"],
    ["Free Uzi RAM: %1 bytes", "RAM de Uzi disponible: %1 bytes", "Vaba töömälu Uzi jaoks: %1 baiti", "Ledigt Uzi RAM-minne: %1 bytes"],
    ["Uzi - Invalid response code: %1", "Uzi - Código de respuesta inválido: %1", "Uzi – Vigane kostekood: %1", "Uzi - ogiltig svarskod"],
    ["Connection timeout!", "¡Expiró el tiempo de espera de la conexión!", "Ühendus aegus!", "Anslutningen avbröts!"],
  ['%1 detected on script "%2". The script has been stopped.', 'Se detectó %1 en el script "%2". El script ha sido detenido.', '%1 avastatud skriptis "%2". Skript on peatatud.', '%1 hittades i skriptet %2. Skriptet har stoppats.'],
    ["Requesting connection...", "Solicitando conexión...", "Ühendust taotletakse...", "Begär anslutning..."],
    ["Connection accepted!", "¡Conexión aceptada!", "Ühendus aktsepteeriti!", "Anslutningen accepterad!"],
    ["Connection rejected", "Conexión rechazada", "Ühendus lükati tagasi!", "Anslutningen avvisad!"],
    ["Connection timeout", "Expiró el tiempo de espera de la conexión", "Ühendus aegus", "Anslutnings-timeout"],

    // Blockly
    ["toggle pin %1", "alternar pin %1", "lülita ümber viigu %1 väärtus", "växla värdet på ben %1"],
    ["%1 pin %2", "%1 pin %2", "%1 viik %2", "%1 ben %2"],
    ["wait %1 %2", "esperar %1 %2", "oota %1 kehtib %2", "vänta %1 %2"],
    ["wait", "esperar", "oota", "vänta"],
    ["is %1 pin %2", "está %1 el pin %2", "on viik %1 %2", "är ben %1 %2"],
    ["read pin %1", "leer pin %1", "loe viiku %1", "läs värdet på ben %1"],
    ["write pin %1 value %2", "escribir en el pin %1 el valor %2", "määra viigu %1 väärtuseks %2", "sätt värde %2 på ben %1"],
    ["repeat forever \n %1", "repetir por siempre \n %1", "korda igavesti \n %1", "upprepa för evigt \n %1"],
    ["elapsed %1", "%1 transcurridos", "kuni %1 on möödunud", "tills %1 förflutit"],
    ["move servo on pin %1 degrees %2", "mover servo en pin %1 grados %2", "pööra servot viigus %1 %2 kraadini", "vrid servot i ben %1 till %2 grader"],
    ["repeat", "repetir", "korda", "upprepa"],
    ["repeat %1 times \n %2", "repetir %1 veces \n %2", "korda %1 korda \n %2", "upprepa %1 gånger \n %2"],
    ["count with %1 from %2 to %3 by %4", "contar con %1 desde %2 hasta %3 por %4", "loenda muutujat %1 \n alates %2 kuni %3 sammuga %4", "räkna med variabeln %1 från %2 till %3 med steg av %4"],
    ["timer named %1 running %2 times per %3 initial state %4 %5", "temporizador llamado %1 ejecutándose %2 veces por %3 estado inicial %4 %5", "kell nimega %1 tiksub %2 korda iga %3 algseisuga %4 %5", "timer med namn %1 som tickar %2 gånger per %3 med initialt tillstånd %4 %5"],
    ["task named %1 %2", "tarea llamada %1 %2", "ülesanne nimega %1 %2", "jobb med namn %1 %2"],
    ["if %1 then %2", "si %1 entonces %2", "juhul kui kehtib %1 siis %2", "om %1 isåfall %2"],
    ["if %1 then %2 else %3", "si %1 entonces %2 si no %3", "juhul kui kehtib %1 siis %2 muidu %3", "om %1 isåfall %2 annars %3"],
    ["stop", "detener", "peata", "stop"],
    ["start", "iniciar", "start", "start"],
    ["resume", "continuar", "jätka", "återta"],
    ["pause", "pausar", "paus", "paus"],
    ["run", "ejecutar", "käivita", "kör"],
    ["turn on", "encender", "lülita sisse", "slå på"],
    ["turn off", "apagar", "lülita välja", "slå av"],
    ["on", "encendido", "sees", "på"],
    ["off", "apagado", "väljas", "av"],
    ["milliseconds", "milisegundos", "millisekundit", "millisekunder"],
    ["seconds", "segundos", "sekundit", "sekunder"],
    ["minutes", "minutos", "minutit", "minuter"],
    ["second", "segundo", "sekund", "sekund"],
    ["minute", "minute", "minut", "minut"],
    ["hour", "hour", "tund", "timme"],
    ["started", "iniciado", "käivitatud", "startad"],
    ["stopped", "detenido", "peatatud", "stoppad"],
    ["move %1 %2 at speed %3", "mover %1 hacia %2 a velocidad %3", "liiguta mootorit %1 suunas %2 kiirusega %3", "rotera motorn %1 i riktning %2 med hastigheten %2"],
    ["set %1 speed to %2", "fijar velocidad de %1 a %2", "määra mootori %1 kiiruseks %2", "sätt motor %1 hastighet till %2"],
    ["read distance from %1 in %2", "leer distancia de %1 en %2", "mõõda kaugus kajaloost %1 ühikutes %2", "läs av avståndet från ekolodet %1 i %2"],
    ["forward", "adelante", "edasi", "framåt"],
    ["backward", "atrás", "tagasi", "bakåt"],
    ["mm", "mm", "mm", "mm"],
    ["cm", "cm", "cm", "cm"],
    ["m", "m", "m", "m"],
    ["while", "mientras que", "senikaua kuni", "medan"],
    ["until", "hasta que", "kuni", "tills"],
    ["true", "verdadero", "tõene", "sann"],
    ["false", "falso", "väär", "falsk"],
    ["and", "y", "ja", "och"],
    ["or", "o", "või", "eller"],
    ["not", "no", "mitte", "inte"],
    ["is even", "es par", "on paarisarv", "är ett jämnt tal"],
    ["is odd", "es impar", "on paaritu arv", "är ett ojämnt tal"],
    ["is prime", "es primo", "on algarv", "är ett primtal"],
    ["is whole", "es entero", "on täisarv", "är ett heltal"],
    ["is positive", "es positivo", "on positiivne", "är positivt"],
    ["is negative", "es negativo", "on negatiivne", "är negativt"],
    ["is divisible by", "es divisible por", "jaguneb arvuga", "är delbart med"],
    ["Tasks", "Tareas", "Tööd", "Jobb"],
    ["GPIO", "GPIO", "Viigud", "Ben"],
    ["Motors", "Motores", "Mootorid", "Motorer"],
    ["Servo", "Servo", "Servo", "Servon"],
    ["DC", "CC", "DC", "DC"],
    ["Sensors", "Sensores", "Andurid", "Sensorer"],
    ["Sonar", "Sonar", "Kajalood", "Ekolod"],
    ["Control", "Control", "Kontroll", "Kontroll"],
    ["Math", "Matemática", "Aritmeetika", "Matematik"],
    ["Variables", "Variables", "Muutujad", "Variabler"],
    ["Functions", "Funciones", "Funktsioonid", "Funktioner"],
    ["Comments", "Comentarios", "Kommentaarid", "Kommentarer"],
    ["Procedures", "Procedimientos", "Protseduurid", "Procedurer"],
    ["Configure DC motors...", "Configurar motores CC...", "Seadista mootorid...", "Konfigurera motorer..."],
    ["Configure sonars...", "Configurar sonares...", "Seadista kajalood...", "Konfigurera ekolod..."],
    ["random integer from %1 to %2", "número entero al azar entre %1 y %2", "suvaline täisarv %1 ja %2 vahel", "slumpmässigt heltal mellan %1 och %2"],
    ["constrain %1 low %2 high %3", "mantener %1 entre %2 y %3", "piira %1 olema %2 ja %3 vahel", "begränsa %1 att vara mellan %2 och %3"],
    ["random fraction", "fracción al azar", "suvaline murdarv 0.0 ja 1.0 vahel", "slumpmässig bråkdel mellan 0.0 och 1.0"],
    ["square root", "raíz cuadrada", "ruutjuur", "roten ur"],
    ["absolute", "valor absoluto", "absoluutväärtus", "absolutvärde"],
    ["-", "-", "-", "-"],
    ["ln", "ln", "ln", "ln"],
    ["log10", "log10", "log10", "log10"],
    ["e^", "e^", "e^", "e^"],
    ["10^", "10^", "10^", "10^"],
    ["sin", "seno", "sin", "sin"],
    ["cos", "coseno", "cos", "cos"],
    ["tan", "tangente", "tan", "tan"],
    ["asin", "arcoseno", "asin", "asin"],
    ["acos", "arcocoseno", "acos", "acos"],
    ["atan", "arcotangente", "atan", "atan"],
    ["round", "redondear", "ümardamine", "avrunda"],
    ["round up", "redondear hacia arriba", "ümarda üles", "avrunda uppåt"],
    ["round down", "redondear hacia abajo", "ümarda alla", "avrunda nedåt"],
    ["remainder of %1 ÷ %2 \n", "resto de %1 ÷ %2 \n", "%1 ÷ %2 jääk", "resten av %1 ÷ %2"],
    ["Configure variables...", "Configurar variables...","Seadista muutujaid...", "Konfigurera variabler..."],
    ["Configure variables", "Configurar variables", "Seadista muutujaid", "Konfigurera variabler"],
    ["Variable name", "Nombre de variable", "Muutuja nimi", "Variabelns namn"],
    ["declare local variable %1 with value %2", "declarar variable local %1 con valor %2", "loo muutuja %1 väärtusega %2", "skapa variabeln %1 med värdet %2"],
    ["set %1 to %2", "establecer %1 a %2", "määra %1 väärtuseks %2", "sätt värdet på %1 till %2"],
    ["increment %1 by %2", "incrementar %1 por %2", "kasvata %1 suurusega %2", "lägg till %2 på %1"],
    ["procedure named %1 %2", "procedimiento llamado %1 %2", "protseduur nimega %1 %2", "procedur med namn %1 %2"],
    ["procedure named %1 with argument %2 %3", "procedimiento llamado %1 con argumento %2 %3", "protseduur nimega %1 argumendiga %2 %3", "procedur med namn %1 och argumentet %2 %3"],
    ["procedure named %1 with arguments %2 %3 %4", "procedimiento llamado %1 con argumentos %2 %3 %4", "protseduur nimega %1 argumentidega %2 %3 %4", "procedur med namn %1 och argumenten %2 %3 %4"],
    ["procedure named %1 with arguments %2 %3 %4 %5", "procedimiento llamado %1 con argumentos %2 %3 %4 %5", "protseduur nimega %1 argumentidega %2 %3 %4 %5", "procedur med namn %1 och argumenten %2 %3 %4 %5"],
    ["exit", "salir", "exit", "stäng"],
    ["execute", "ejecutar", "execute", "kör"],
    ["function named %1 %2", "función llamada %1 %2", "funktsioon nimega %1 %2", "funktion med namn %1 %2"],
    ["function named %1 with argument %2 %3", "función llamada %1 con argumento %2 %3", "funktsioon nimega %1 argumentidega %2 %3", "funktion med namn %1 och argumentet %2 %3"],
    ["function named %1 with arguments %2 %3 %4", "función llamada %1 con argumentos %2 %3 %4", "funktsioon nimega %1 argumentidega %2 %3 %4", "funktion med namn %1 och argument %2 %3 %4"],
    ["function named %1 with arguments %2 %3 %4 %5", "función llamada %1 con argumentos %2 %3 %4 %5", "funktsioon nimega %1 argumentidega %2 %3 %4 %5", "funktion med namn %1 och argument %2 %3 %4 %5"],
    ["return", "devolver", "tagasta", "svara"],
    ["evaluate", "evaluar", "arvuta", "beräkna"],
    ["Sound", "Sonido", "Heli", "Ljud"],
    ["play tone %1 on pin %2", "reproducir tono %1 en el pin %2", "mängi tooni %1 viigus %2", "spela tonen %1 på ben %2"],
    ["play tone %1 on pin %2 for %3 %4", "reproducir tono %1 en el pin %2 durante %3 %4", "mängi tooni %1 viigus %2 %3 %4", "spela tonen %1 på ben %2 under %3 %4"],
    ["stop tone on pin %1", "detener tono en el pin %1", "peata toon viigus %1", "sluta tonen på ben %1"],
    ["stop tone on pin %1 and wait %2 %3", "detener tono en el pin %1 y esperar %2 %3", "peata toon viigus %1 ja oota %2 %3", "sluta tonen på ben %1 och vänta %2 %3"],
    ["Buttons", "Botones", "Lülitid", "Knappar"],
    ["is button %1 on pin %2", "está %1 el botón en el pin %2", "kas lüliti %1 viigus %2", "är knapp %1 på ben %2"],
    ["wait for button %1 on pin %2", "esperar hasta que %1 el botón en el pin %2", "oota lülitit %1 viigus %2", "vänta på knapp %1 på ben %2"],
    ["elapsed milliseconds while pressing %1", "milisegundos transcurridos presionando el pin %1", "möödunud aeg millisekundites %1 vajutuse ajal", "förfluten tid i millisekunder medan %1 nedtryckt"],
    ["pressed", "presionado", "vajutatud", "nedtryckt"],
    ["released", "suelto", "vabastatud", "släppt"],
    ["press", "presione", "vajuta", "tryck"],
    ["release", "suelte", "vabasta", "släpp"],
];
