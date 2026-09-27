const DB_NAME = "V_ZERO_DB_CASAMENTO_2";
let convidados = [];
let modo = 'entrada';
let scanner;
let isScanning = false;
let cameraTrack = null;
let zoomTimer;
let scannerStarted = false;
let cameraStartPromise = null;
let cameraStopPromise = null;
let lastSuccessfulCode = null;
let toastTimer;
let manuallyPaused = false;

const LISTA_INICIAL = [
    {"id":"A1S4","nome":"Casal Alfredo Santos","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"A1S6","nome":"Casal Albertino de Sá","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"A2J9","nome":"Casal António Jimbo","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"A2M6","nome":"Casal Amuyela","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"A2V8","nome":"Casal André Vasco","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"A4M2","nome":"Antónia e Madalena Ngueve","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"A5G7","nome":"Alfredo Gaieta e Justino Cavimbe","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"A5M3","nome":"Anselmo Mande e Osvaldo Nkhole","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"A5N1","nome":"Aureliana e Arilton","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"A6C2","nome":"Casal Armando Carlos","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"A6G1","nome":"Casal Amôs da Graça","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"A7B9","nome":"Ângelo Bernardo","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"A7P3","nome":"Casal André Pinto","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"A9F2","nome":"Casal Armindo de Freitas","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"A9K2","nome":"Casal Avelino Kuyanga","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"B3K7","nome":"Casal Bento Kangwe","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"B8V2","nome":"Casal Boa Ventura (Vitorino Cachimbandi)","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"C3M5","nome":"Casal Camilo","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"C4H2","nome":"Casal Chicba","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"C7C3","nome":"Casal CarinCalonge","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"C7L1","nome":"Casal Chilepa","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"C8C1","nome":"Casal Camilo Castro","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"D9C5","nome":"Casal Domilde Calembe","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"D9N4","nome":"Domingas Cafecas e Natalia Bungo","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"E1B6","nome":"Casal Eduardo Braz","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"E2B9","nome":"Casal Esmael Barco","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"E2N8","nome":"Ester Ngueve e Yolanda","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"E4T7","nome":"Casal Ernesto Trindade","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"E5A3","nome":"Casal Emídio","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"E6J1","nome":"Casal Erineu Jimbo","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"E7A9","nome":"Edgar e Acompanhante","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"E9A3","nome":"Eurico de Assís e Moisés Pereira","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"F1T3","nome":"Casal Feliciano Tchombossi","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"F3P9","nome":"Casal Felipe","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"F4D8","nome":"Figuy Domingos e Júlio dos Santos","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"F5N1","nome":"Francisco Nambe e Márcio","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"F9R1","nome":"Casal Francisco Romano","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"H2L5","nome":"Casal Helder Lucas","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"H4S1","nome":"Casal Henriques Sawalele","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"H5C4","nome":"Casal Hamilton Cassoma","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"H6C3","nome":"Casal Hélder Contreiras","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"I3E7","nome":"Isaque e Inho","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"I3M8","nome":"Isabel Monica, Lidia e Micaela","mesa":"MESA NÃO DEFINIDA","limite":3},
    {"id":"J1C9","nome":"Casal José Cassinda (Madaleno Soma)","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"J1G4","nome":"Casal José Paulino Gaieta","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"J1V6","nome":"Casal Januário Vitorino","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"J2C5","nome":"Jorge Chimuco e Faustina Wolo","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"J3F2","nome":"João Fernandes e Ruí Sousa","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"J3N8","nome":"Júlia Ningui e Lúcia Ningui","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"J4C3","nome":"Júlia Chilombo e Folo","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"J5L9","nome":"Casal Júlio Lucamba","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"J6L8","nome":"Casal Justino Lourdes","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"J7K3","nome":"Casal João Kalei","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"J9D4","nome":"Casal João Daniel","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"K9A5","nome":"Casal Kamussamba","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"L4E8","nome":"Luizinha e Esposo","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"L5U2","nome":"Lúcia e Filha","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"M1A9","nome":"Casal Maquina Armando","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"M1N6","nome":"Casal Manuel Ningui","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"M2A4","nome":"Martinha de Águeda e Marieta das Dores","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"M3R8","nome":"Casal Mário Rodrigues","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"M4A2","nome":"Casal Malaquias Aurélio","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"M4V2","nome":"Casal Mario Vitorino","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"M5T1","nome":"Casal Marcelo Tchombossi","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"M7T4","nome":"Casal Maurício Tibério","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"M8J1","nome":"Casal Márcio Joaquim","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"M9N5","nome":"Madalena Ngueve e Manuela Ningui","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"N2L7","nome":"Nelo Lucas e Cleria","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"N4R6","nome":"Nelson Rodrigues e Rosária Rodrigues","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"O1A8","nome":"Casal Obadias Abraão","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"O8P4","nome":"Casal Olavo Pereira","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"P2S9","nome":"Paulo Sangalo","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"P4C7","nome":"Paulina Cossale e Adelaide Capanga","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"P6G2","nome":"Casal Paulo Gomes","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"R3B7","nome":"Casal Rodrigues Bango","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"R5N2","nome":"Rosalina Nené e Jojó Joaquim","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"R8U2","nome":"Casal Rafael Ulombe","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"R9A5","nome":"Roque Alves e Guilherme Frazão","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"S3B7","nome":"Casal Sabino","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"S4P1","nome":"Casal Sequeira Pacheco","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"S7J2","nome":"Salomão Jorge, João Carlos e Garcês Abraão","mesa":"MESA NÃO DEFINIDA","limite":3},
    {"id":"S8Q3","nome":"Sara Querida e Josseth","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"T1C6","nome":"Toy Calepete","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"T1J6","nome":"Tia Minga e Jota Gomes","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"T2F9","nome":"Teresa Felipe, Verónica Monteiro e Filomena Monteiro","mesa":"MESA NÃO DEFINIDA","limite":3},
    {"id":"T3C7","nome":"Trio Cordeiro","mesa":"MESA NÃO DEFINIDA","limite":3},
    {"id":"T4C6","nome":"Casal Tomás Chivela","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"T4F8","nome":"Teresa Felipe e Layne","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"T6B8","nome":"Teresa Baptista e Cinco Reis","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"T9J3","nome":"Tina Jimbo","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"V2C5","nome":"Vitória Cavonguelua","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"V2C7","nome":"Casal Vitorino Cachimbande","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"V4S9","nome":"Casal Vitorino Sawongo","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"V7G3","nome":"Casal Vlad Gaspar","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"V8R4","nome":"Vocal Reencontro e Mandjolo","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"A1A4","nome":"Casal Abílio António","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"A6C9","nome":"Casal Augusto Candy","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"A9T4","nome":"Casal Alberto Tchombossi","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"A9C4","nome":"Casal Amado Caiombo","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"A1N9","nome":"Casal António","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"A5J3","nome":"Casal António João","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"A2S9","nome":"Casal Assís Sacusseia","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"A2L6","nome":"Casal Áureo Lituai","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"A8S5","nome":"Casal Azemar Sekesseque","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"B6P1","nome":"Casal Bruno Paiva","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"C4M5","nome":"Casal Camilo","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"C8M1","nome":"Casal Camoli","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"C5C2","nome":"Casal Cameia","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"C5R9","nome":"Casal Carruagem","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"C3E7","nome":"Casal Celestino","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"C9E2","nome":"Casal César","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"D2J7","nome":"Casal David João","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"D1L4","nome":"Casal Diló","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"E7E1","nome":"Casal Elisa e Esposo","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"E8A3","nome":"Casal Emílio Aspirante","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"E6A1","nome":"Casal Enoque Aspirante","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"E3S7","nome":"Casal Estevão Sangueve","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"F5I8","nome":"Casal Fifi","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"F5M1","nome":"Casal Franciso Mupila","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"F7I1","nome":"Casal Filipe Inácio","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"F9A3","nome":"Casal Fraústo","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"F5R2","nome":"Casal Freitas","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"G6I3","nome":"Casal Gideão","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"H1O8","nome":"Casal Horácio","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"I7M3","nome":"Casal Inácio Muana","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"I4L6","nome":"Casal Inocêncio Lopes","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"J2C8","nome":"Casal José Catimba","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"J4E7","nome":"Casal Jeremias","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"K9C4","nome":"Casal Kilas Camisa","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"L3A7","nome":"Casal Laurindo","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"L2S4","nome":"Casal Linduva","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"L4C8","nome":"Casal Lucas Caúto","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"M6B9","nome":"Casal Manuel Bento","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"M9M4","nome":"Casal Manuel Mupila","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"M3G9","nome":"Casal Mateus Guimarães","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"M2D6","nome":"Casal Mateus Domingos","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"M5C2","nome":"Casal Mauro Caiombo","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"M5G8","nome":"Casal Mister Gomes","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"M8P2","nome":"Casal Mupila","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"N8F2","nome":"Casal Niny Frederico","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"O3E8","nome":"Casal Olívio Ernesto","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"P9F4","nome":"Casal Pastoral Pedro Fonseca","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"S8P3","nome":"Casal Sapingãla","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"S3A8","nome":"Casal Sasango","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"S3O9","nome":"Casal Sousa","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"S2A8","nome":"Casal Santos","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"T7C9","nome":"Casal Tito Caiombo","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"V1C6","nome":"Casal Vado Camisa","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"W5E8","nome":"Casal Walter Ernesto","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"W2F5","nome":"Casal Wandalica de Freitas","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"A4S1","nome":"Abel e Suraia","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"A3G8","nome":"Agnaldo","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"A7B3","nome":"Aminalda e Benedita","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"A9T5","nome":"Angêlica e Tânia","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"A1T6","nome":"Anita e Teresa","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"A5M1","nome":"Avó Maria e Sónia","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"B1F6","nome":"Avo Benita e Faty","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"B7M4","nome":"Benvinda e Marivalda","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"C1S6","nome":"Cisio e Silvano","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"D2S7","nome":"Dadinho e Salomão","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"E4A9","nome":"Edinho e Amarilson","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"E2M7","nome":"Edson e Márcia","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"G8D3","nome":"Geny e Domingas","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"G4Z8","nome":"Graça e Zilpa","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"I5M8","nome":"Isabel e Madalena Dumbo","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"J1E6","nome":"Joana e Edy","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"J7C3","nome":"Jovania e Clemente","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"J1A3","nome":"Jonas e Ariel","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"K9A1","nome":"Katy e Aya","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"L3L9","nome":"Tia Lourdes e Luly","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"M3T8","nome":"Mana Mena e Teresa","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"M7G1","nome":"Mandefo e Gilson","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"M6T2","nome":"Márcia e Tita","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"R4C8","nome":"Rita e Cicí","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"S1G6","nome":"Salucunhe","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"T2A6","nome":"Tia Alice e Esposo","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"Z1T7","nome":"Zezinho e Tito","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"F5C2","nome":"Fernando e Rosalina Catiavala","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"F9F3","nome":"Fernando e Francisca","mesa":"MESA NÃO DEFINIDA","limite":2},
    {"id":"T7C6","nome":"Terêncio e Israel Chilunda","mesa":"MESA NÃO DEFINIDA","limite":2}
].map(c => ({ ...c, dentro: 0 }));

function checkAuth() {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('app-screen').style.display = 'block';
    loadData();
}

function loadData() {
    const saved = localStorage.getItem(DB_NAME);
    convidados = saved ? JSON.parse(saved) : LISTA_INICIAL;
    initScanner();
}

function initScanner() {
    scanner = new Html5Qrcode('reader');
}

function triggerScan() {
    document.getElementById('camera-modal').classList.add('active');
    document.body.classList.add('camera-open');
    manuallyPaused = false;
    openCameraPreview();
}

function getScannerConfig() {
    return {
        fps: 20,
        qrbox: (width, height) => {
            const size = Math.floor(Math.min(width, height) * 0.72);
            return { width: size, height: size };
        }
    };
}

async function openCameraPreview() {
    if (cameraStopPromise) await cameraStopPromise;

    if (scannerStarted) {
        isScanning = false;
        scanner.pause();
        updateReadingButtons();
        return;
    }

    isScanning = false;
    updateReadingButtons();
    showCameraToast('ABRINDO CÂMERA', 'Aguarde a autorização da câmera...');

    cameraStartPromise = scanner.start(
        { facingMode: 'environment' },
        getScannerConfig(),
        onScanSuccess
    ).then(() => {
        scannerStarted = true;
        scanner.pause();
        syncCameraControls();
        updateReadingButtons();
        showCameraToast('CÂMERA PRONTA', 'Toque em “SCANEAR AGORA” para ler o convite.');
    }).catch(error => {
        isScanning = false;
        updateReadingButtons();
        showCameraToast('CÂMERA INDISPONÍVEL', error.message || 'Verifique a permissão de câmera e tente novamente.', 'error');
    }).finally(() => {
        cameraStartPromise = null;
        updateReadingButtons();
    });

    await cameraStartPromise;
}

async function startReading() {
    if (cameraStopPromise) await cameraStopPromise;
    if (cameraStartPromise) await cameraStartPromise;

    if (scannerStarted) {
        isScanning = true;
        manuallyPaused = false;
        lastSuccessfulCode = null;
        scanner.resume();
        updateReadingButtons();
        showCameraToast('LEITURA INICIADA', 'Aponte para o QR Code. Após a leitura, toque em “SCANEAR” novamente.');
        return;
    }

    isScanning = false;
    manuallyPaused = false;
    await openCameraPreview();
    if (scannerStarted) await startReading();
}

function updateReadingButtons() {
    const pauseButton = document.getElementById('btn-toggle-reading');
    const scanButton = document.getElementById('btn-modal-scan');
    if (pauseButton) {
        pauseButton.textContent = 'PARAR LEITURA';
        pauseButton.disabled = !scannerStarted && !cameraStartPromise;
    }
    if (scanButton) {
        scanButton.textContent = cameraStartPromise ? 'ABRINDO CÂMERA...' : (isScanning ? 'LENDO...' : 'SCANEAR');
        scanButton.disabled = isScanning || Boolean(cameraStartPromise) || Boolean(cameraStopPromise);
    }
}

async function toggleReading() {
    isScanning = false;
    manuallyPaused = true;
    updateReadingButtons();

    if (cameraStartPromise) await cameraStartPromise;
    if (scannerStarted) {
        cameraStopPromise = scanner.stop().catch(() => {}).finally(() => {
            scannerStarted = false;
            cameraTrack = null;
            cameraStopPromise = null;
            updateReadingButtons();
        });
        await cameraStopPromise;
    }

    document.getElementById('camera-status').textContent = 'Câmera desligada. Toque em “SCANEAR” para iniciar novamente.';
    showCameraToast('LEITURA PARADA', 'Toque em “SCANEAR” para ligar a câmera e ler novamente.');
}

async function closeCameraModal() {
    document.getElementById('camera-modal').classList.remove('active');
    document.body.classList.remove('camera-open');
    isScanning = false;
    manuallyPaused = false;
    lastSuccessfulCode = null;
    clearTimeout(toastTimer);

    if (cameraStartPromise) await cameraStartPromise;
    if (scannerStarted) {
        cameraStopPromise = scanner.stop().catch(() => {}).finally(() => {
            scannerStarted = false;
            cameraTrack = null;
            cameraStopPromise = null;
        });
        await cameraStopPromise;
    }

    const toast = document.getElementById('camera-toast');
    toast.className = '';
    document.getElementById('fb-title').textContent = 'CÂMERA FECHADA';
    document.getElementById('fb-desc').textContent = 'Toque em “Abrir câmera” para iniciar uma nova leitura.';
}

function syncCameraControls() {
    const video = document.querySelector('#reader video');
    cameraTrack = video?.srcObject?.getVideoTracks?.()[0] || null;

    const focusButton = document.getElementById('btn-focus');
    const zoomSlider = document.getElementById('camera-zoom');
    const zoomValue = document.getElementById('zoom-value');
    const status = document.getElementById('camera-status');

    if (!cameraTrack) {
        focusButton.disabled = true;
        zoomSlider.disabled = true;
        status.textContent = 'Inicie a câmera para liberar foco e zoom.';
        return;
    }

    const capabilities = cameraTrack.getCapabilities?.() || {};
    focusButton.disabled = false;

    if (capabilities.zoom) {
        const currentZoom = Number(zoomSlider.value);
        zoomSlider.min = capabilities.zoom.min;
        zoomSlider.max = capabilities.zoom.max;
        zoomSlider.step = capabilities.zoom.step || 0.1;
        zoomSlider.value = Math.max(capabilities.zoom.min, Math.min(capabilities.zoom.max, currentZoom));
        zoomSlider.disabled = false;
        zoomValue.textContent = `${Number(zoomSlider.value).toFixed(1)}×`;
        status.textContent = 'Ajuste o zoom e use o foco automático se a imagem estiver desfocada.';
    } else {
        zoomSlider.disabled = true;
        status.textContent = 'A câmera está ativa, mas este navegador não disponibiliza zoom ajustável.';
    }
}

async function improveCameraFocus() {
    syncCameraControls();
    const status = document.getElementById('camera-status');

    if (!cameraTrack) {
        status.textContent = 'Inicie a câmera antes de ajustar o foco.';
        return;
    }

    try {
        await cameraTrack.applyConstraints({ advanced: [{ focusMode: 'continuous' }] });
        status.textContent = 'Foco contínuo solicitado. A disponibilidade depende do iPhone e do navegador.';
    } catch (error) {
        status.textContent = 'Este navegador não permite controlar o foco; o iPhone continuará usando o foco automático padrão.';
    }
}

function setCameraZoom(value) {
    const slider = document.getElementById('camera-zoom');
    document.getElementById('zoom-value').textContent = `${Number(value).toFixed(1)}×`;
    clearTimeout(zoomTimer);
    zoomTimer = setTimeout(async () => {
        syncCameraControls();
        if (!cameraTrack || slider.disabled) return;

        try {
            await cameraTrack.applyConstraints({ advanced: [{ zoom: Number(value) }] });
        } catch (error) {
            slider.disabled = true;
            document.getElementById('camera-status').textContent = 'Não foi possível aplicar o zoom neste dispositivo ou navegador.';
        }
    }, 120);
}

function showCameraToast(title, description, type = '') {
    const toast = document.getElementById('camera-toast');
    if (!toast) return;

    clearTimeout(toastTimer);
    document.getElementById('camera-toast-title').textContent = title;
    document.getElementById('camera-toast-desc').textContent = description;
    toast.className = `visible ${type}`.trim();
    toastTimer = setTimeout(() => toast.classList.remove('visible'), 2800);
}

function getGuestById(code) {
    return [...convidados].reverse().find(g => g.id === code);
}

function onScanSuccess(code) {
    if (!isScanning) return;
    if (code === lastSuccessfulCode) return;
    lastSuccessfulCode = code;
    isScanning = false;
    manuallyPaused = false;
    if (scannerStarted) scanner.pause();
    updateReadingButtons();

    const guest = getGuestById(code);
    const box = document.getElementById('feedback');
    const title = document.getElementById('fb-title');
    const desc = document.getElementById('fb-desc');

    box.className = 'status-box';

    if (guest) {
        const mesa = guest.mesa || 'MESA NÃO DEFINIDA';

        if (modo === 'entrada') {
            if (guest.dentro < guest.limite) {
                guest.dentro++;
                box.classList.add('bg-success');
                title.textContent = "✅ AUTORIZADO";
                desc.innerHTML = `<strong>${guest.nome}</strong><br><span>${mesa}</span><br><small>${guest.dentro}/${guest.limite}</small>`;
            } else {
                box.classList.add('bg-error');
                title.textContent = "🚫 ESGOTADO";
                desc.innerHTML = `<strong>${guest.nome}</strong><br><span>${mesa}</span><br><small>Limite atingido.</small>`;
            }
        } else {
            if (guest.dentro > 0) {
                guest.dentro--;
                box.classList.add('bg-success');
                title.textContent = "📤 SAÍDA";
                desc.innerHTML = `<strong>Saída de: ${guest.nome}</strong><br><span>${mesa}</span>`;
            } else {
                box.classList.add('bg-error');
                title.textContent = "⚠️ VAZIO";
                desc.innerHTML = `<strong>${guest.nome}</strong><br><span>${mesa}</span><br><small>Ninguém deste grupo consta como presente.</small>`;
            }
        }
        localStorage.setItem(DB_NAME, JSON.stringify(convidados));
        showCameraToast(title.textContent, desc.innerText, box.classList.contains('bg-success') ? 'success' : 'error');
    } else {
        box.classList.add('bg-error');
        title.textContent = "❌ NÃO CONSTA";
        desc.textContent = "ID Inválido.";
        showCameraToast(title.textContent, desc.textContent, 'error');
    }
}

function setMode(m) {
    modo = m;
    document.getElementById('mode-in').className = m === 'entrada' ? 'active' : '';
    document.getElementById('mode-out').className = m === 'saida' ? 'active' : '';
    document.getElementById('fb-title').textContent = "MODO: " + m.toUpperCase();
    document.getElementById('fb-desc').textContent = "Pressione o botão para ler.";
}

function showSection(id) {
    document.querySelectorAll('.section').forEach(s => s.style.display = 'none');
    document.getElementById('sec-' + id).style.display = 'block';
    if(id === 'list') renderTable();
}

function renderTable() {
    const total = convidados.reduce((acc, g) => acc + g.dentro, 0);
    document.getElementById('count-in').textContent = total;
    document.getElementById('count-total').textContent = convidados.length;
    let h = `<table><tr><th>Convidado</th><th>Mesa</th><th>In</th><th>Lim</th></tr>`;
    convidados.sort((a, b) => (a.mesa || '').localeCompare(b.mesa || '') || a.nome.localeCompare(b.nome)).forEach(g => {
        h += `<tr class="${g.dentro > 0 ? 'present' : ''}"><td>${g.nome}</td><td>${g.mesa || 'Sem mesa'}</td><td>${g.dentro}</td><td>${g.limite}</td></tr>`;
    });
    document.getElementById('list-table').innerHTML = h + `</table>`;
}

function resetSystem() {
    if(confirm("Deseja recarregar a lista do evento e limpar os registros atuais?")) {
        const baseList = LISTA_INICIAL.map(c => ({ ...c, dentro: 0 }));
        convidados = [...baseList];
        localStorage.setItem(DB_NAME, JSON.stringify(convidados));

        if (document.getElementById('sec-list').style.display !== 'none') {
            renderTable();
        }

        const box = document.getElementById('feedback');
        if (box) {
            box.className = 'status-box';
            document.getElementById('fb-title').textContent = 'LISTA RECARREGADA';
            document.getElementById('fb-desc').textContent = 'A lista foi carregada novamente.';
        }
    }
}
