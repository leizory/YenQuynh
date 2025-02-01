// Khởi tạo AOS
AOS.init({
    duration: 1000,
    once: true
});

// Hiệu ứng typing text
const typingText = document.querySelector('.typing-text');
const text = "Chúc mừng sinh nhật Yến Quỳnh nhaaa! Chúc bé tuổi mới luôn xinh đẹp, nhí nhảnh và tài giỏi nhaaaaa =)) bé giỏi lắm nèe. 🎉🎂";
let index = 0;

function typeText() {
    if (index < text.length) {
        typingText.textContent += text.charAt(index);
        index++;
        setTimeout(typeText, 100);
    }
}

typeText();

// Tạo hiệu ứng confetti
function createConfetti() {
    const colors = ['#FFB6C1', '#FFC0CB', '#ffffff', '#FFE4E1'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
        confetti.style.opacity = Math.random();
        document.querySelector('.confetti-container').appendChild(confetti);
    }
}

// Đọc dữ liệu từ file JSON
async function loadImages() {
    try {
        const response = await fetch('images.json');
        const data = await response.json();
        
        // Cập nhật ảnh profile
        const profileImg = document.querySelector('.profile-image img');
        profileImg.src = data.profile.url;
        profileImg.alt = data.profile.description;
        
        // Tạo gallery
        createGallery(data.images);
    } catch (error) {
        console.error('Error loading images:', error);
    }
}

// Sửa lại hàm createGallery để nhận dữ liệu từ JSON
function createGallery(images) {
    const galleryGrid = document.getElementById('galleryGrid');
    
    images.forEach((item, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        // Thêm rotation ngẫu nhiên nhẹ nhàng
        const rotation = (index % 2 === 0 ? 1 : -1) * (Math.random() * 1.5 + 0.5);
        galleryItem.style.setProperty('--rotation', `${rotation}deg`);
        
        galleryItem.innerHTML = `
            <img src="${item.url}" alt="${item.description}" data-aos="fade-up">
            <div class="caption">Yến Quỳnh</div>
        `;
        
        galleryItem.addEventListener('click', () => openModal(item.url));
        
        // Thêm animation xuất hiện dần dần
        galleryItem.style.opacity = '0';
        galleryItem.style.animation = `fadeIn 0.5s ease-out ${index * 0.1}s forwards`;
        
        galleryGrid.appendChild(galleryItem);
    });
}

// Xử lý modal ảnh
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImage');
const closeModal = document.querySelector('.close-modal');

function openModal(imgUrl) {
    modal.style.display = 'block';
    modalImg.src = imgUrl;
}

closeModal.onclick = function() {
    modal.style.display = 'none';
}

// Thêm hàm tạo bong bóng
function createBubbles() {
    const container = document.querySelector('.bubbles-container');
    const maxBubbles = 10; // Số lượng bong bóng tối đa trên màn hình
    let activeBubbles = 0;

    function createBubble() {
        if (activeBubbles >= maxBubbles) return;
        
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        
        // Random size từ 20px đến 60px
        const size = Math.random() * 40 + 20;
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        
        // Random vị trí theo chiều ngang
        bubble.style.left = `${Math.random() * 100}%`;
        
        // Random thời gian animation từ 4s đến 8s
        const duration = Math.random() * 4 + 4;
        bubble.style.setProperty('--duration', `${duration}s`);

        container.appendChild(bubble);
        activeBubbles++;

        // Xóa bong bóng sau khi animation kết thúc
        bubble.addEventListener('animationend', () => {
            bubble.remove();
            activeBubbles--;
            // Tạo bong bóng mới khi một bong bóng biến mất
            setTimeout(createBubble, Math.random() * 1000);
        });
    }

    // Tạo bong bóng ban đầu
    for (let i = 0; i < maxBubbles; i++) {
        setTimeout(createBubble, i * 300);
    }
}

// Xử lý phát nhạc
let currentSongIndex = 0;
const bgMusic = document.getElementById('bgMusic');
const toggleMusic = document.getElementById('toggleMusic');
let isMusicPlaying = true;

async function loadAndPlayMusic() {
    try {
        const response = await fetch('music.json');
        const data = await response.json();
        const playlist = data.playlist;

        function playNextSong() {
            bgMusic.src = playlist[currentSongIndex].url;
            bgMusic.load();
            bgMusic.play().catch(error => {
                console.log('Autoplay prevented');
                // Thêm event listener để phát nhạc khi có tương tác
                document.addEventListener('click', function playHandler() {
                    bgMusic.play();
                    document.removeEventListener('click', playHandler);
                }, { once: true });
            });
        }

        // Chuyển bài khi hết bài hiện tại
        bgMusic.addEventListener('ended', () => {
            currentSongIndex = (currentSongIndex + 1) % playlist.length;
            playNextSong();
        });

        // Phát bài đầu tiên
        playNextSong();

        // Xử lý nút bật/tắt nhạc
        toggleMusic.addEventListener('click', () => {
            if (isMusicPlaying) {
                bgMusic.pause();
                toggleMusic.innerHTML = '<i class="fas fa-play"></i>';
                toggleMusic.classList.add('paused');
            } else {
                bgMusic.play();
                toggleMusic.innerHTML = '<i class="fas fa-pause"></i>';
                toggleMusic.classList.remove('paused');
            }
            isMusicPlaying = !isMusicPlaying;
        });
    } catch (error) {
        console.error('Error loading music:', error);
    }
}

// Thêm createBubbles vào phần khởi tạo
document.addEventListener('DOMContentLoaded', () => {
    createConfetti();
    loadImages();
    createBubbles();
    loadAndPlayMusic();
}); 