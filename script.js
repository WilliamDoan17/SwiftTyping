document.addEventListener('DOMContentLoaded', function() {
// Phần 1: Khai báo các biến và hằng số
    const body = document.body;
    const sidebar = document.querySelector('.sidebar');
    const toggleBtn = document.querySelector('.toggle-sidebar-btn');
    const mainContents = document.querySelectorAll('.main-content');
    const sidebarLinks = document.querySelectorAll('.sidebar-menu a');
    const sliderContainer = document.querySelector('.hero-slider-container');
    const slides = document.querySelectorAll('.hero-slide');
    const prevButton = document.querySelector('.prev-slide');
    const nextButton = document.querySelector('.next-slide');
    const indicators = document.querySelectorAll('.indicator');

    const wordDisplay = document.querySelector('.word-display');
    const typingInput = document.getElementById('typing-input');
    const timeDisplay = document.getElementById('time');
    const wpmDisplay = document.getElementById('wpm');
    const accuracyDisplay = document.getElementById('accuracy');
    const restartButton = document.getElementById('restart-btn');
    const resultsSection = document.getElementById('results');
    const finalWpmDisplay = document.getElementById('final-wpm');
    const finalAccuracyDisplay = document.getElementById('final-accuracy');
    const totalCharsDisplay = document.getElementById('total-chars');
    const correctCharsDisplay = document.getElementById('correct-chars');
    const incorrectCharsDisplay = document.getElementById('incorrect-chars');
    const statisticsPage = document.getElementById('statistics-page');
    const overviewTab = document.getElementById('overview-tab');
    const historyTab = document.getElementById('history-tab');
    const historyListElement = document.getElementById('history-list');
    const tabButtons = document.querySelectorAll('.statistics-tabs .tab-button');
    const DURATION_KEY = 'typingDuration';
    const SHOW_TYPO_KEY = 'showTypo';
    const DARK_MODE_KEY = 'darkMode';
    const SOUND_KEY = 'sound';
    const showTypoSwitch = document.getElementById('show-typo-switch');
    let isTypoShown = getTypingSetting(SHOW_TYPO_KEY, 'true') === 'true';
    let isDarkModeEnabled = getTypingSetting(DARK_MODE_KEY, 'true') === 'true';
    let isSoundEnabled = getTypingSetting(SOUND_KEY, 'true') === 'true';
    const switches = document.querySelectorAll('.switch');
    const darkModeSwitch = document.getElementById('dark-mode-switch'); // Thêm dòng này
    const historyFilterDateInput = document.getElementById('history-filter-date');
    const historySortBySelect = document.getElementById('history-sort-by');
    const noDataMessage = document.getElementById('no-data-message');
    const historyTable = document.getElementById('history-table');
    const historyTableBody = document.querySelector('#history-table tbody');
    const historyFilters = document.querySelectorAll('.history-filters');
    const correctSound = document.getElementById('correct-sound');
    const incorrectSound = document.getElementById('incorrect-sound');
    const soundEffectsSwitch = document.getElementById('sound-effects-switch');

    function saveTypingSetting(key, value) {
        localStorage.setItem(key, value);
    }
    
    function getTypingSetting(key, defaultValue) {
        return localStorage.getItem(key) || defaultValue;
    }
    
    if (showTypoSwitch) {
        showTypoSwitch.checked = getTypingSetting(SHOW_TYPO_KEY, 'true') === 'true';
        showTypoSwitch.addEventListener('change', function() {
            const isChecked = this.checked;
            saveTypingSetting(SHOW_TYPO_KEY, isChecked);
            isTypoShown = isChecked; // Cập nhật trực tiếp biến isTypoShown
        });
    }

    // Lấy các phần tử HTML liên quan đến tùy chọn thời gian
    const durationSelect = document.getElementById('duration-select');
    const customDurationInputContainer = document.querySelector('.custom-duration-input');
    const customDurationInput = document.getElementById('custom-duration'); // Đảm bảo đã khai báo

    // Ẩn phần nhập số giây tùy chỉnh ban đầu và thiết lập giá trị ban đầu
    if (customDurationInputContainer) {
        const durationType = getTypingSetting(DURATION_KEY + '_type', 'fixed').toLowerCase();
        customDurationInputContainer.style.display = durationType === 'custom' ? 'flex' : 'none';

        if (customDurationInput) {
            // Lấy giá trị tùy chỉnh đã lưu và hiển thị
            const savedCustomDuration = getTypingSetting(DURATION_KEY + '_custom', '60');
            customDurationInput.value = savedCustomDuration;

            customDurationInput.addEventListener('input', function() {
                saveTypingSetting(DURATION_KEY + '_custom', this.value);
            });
        }
    }
    if (durationSelect) {
        durationSelect.value = getTypingSetting(DURATION_KEY + '_type', '1'); // Mặc định là 1 phút

        durationSelect.addEventListener('change', function() {
            saveTypingSetting(DURATION_KEY + '_type', this.value);
            if (this.value === 'Custom') {
                if (customDurationInputContainer) {
                    customDurationInputContainer.style.display = 'flex';
                    // Đảm bảo hiển thị lại giá trị đã lưu khi chuyển sang Custom
                    if (customDurationInput) {
                        const savedCustomDuration = getTypingSetting(DURATION_KEY + '_custom', '60');
                        customDurationInput.value = savedCustomDuration;
                    }
                }
            } else {
                if (customDurationInputContainer) {
                    customDurationInputContainer.style.display = 'none';
                }
                // Lưu giá trị cố định đã chọn để lần sau còn nhớ
                saveTypingSetting(DURATION_KEY + '_fixed', this.value);
            }
            // Có thể bạn muốn gọi initTypingGame() ở đây nếu trang Luyện gõ đang mở
        });
    }


    if (isDarkModeEnabled) {
        body.classList.add('dark-mode');
    } else {
        body.classList.remove('dark-mode');
    }

    if (darkModeSwitch) {
        darkModeSwitch.checked = getTypingSetting(DARK_MODE_KEY, 'true') === 'true';
        darkModeSwitch.addEventListener('change', function() {
            const isChecked = this.checked;
            saveTypingSetting(DARK_MODE_KEY, isChecked);
            isDarkModeEnabled = isChecked;
            body.classList.toggle('dark-mode');
        });
    }

    if (soundEffectsSwitch) {
        soundEffectsSwitch.addEventListener('change', function() {
            isSoundEnabled = this.checked;
            saveTypingSetting('soundEffects', isSoundEnabled); // Lưu cài đặt
        });
        // Khởi tạo trạng thái ban đầu từ localStorage (nếu có)
        isSoundEnabled = getTypingSetting('soundEffects', 'false') === 'true';
        soundEffectsSwitch.checked = isSoundEnabled;
    }

    function playSound(audio, volume = 1.0) {
        if (isSoundEnabled && audio) {
            audio.currentTime = 0;
            audio.volume = volume; // Đặt âm lượng
            audio.play();
        }
    }

    switches.forEach(switchElement => {
        const labelTextElement = switchElement.nextElementSibling; // Lấy phần tử span.switch-label-text
        const inputElement = switchElement.querySelector('input');

        switchElement.addEventListener('change', () => { // Sử dụng arrow function
            if (inputElement.checked) {
                labelTextElement.innerText = 'Bật';
            } else {
                labelTextElement.innerText = 'Tắt';
            }
        });

        // Thiết lập trạng thái ban đầu khi trang tải
        if (inputElement.checked) {
            labelTextElement.innerText = 'Bật';
        } else {
            labelTextElement.innerText = 'Tắt';
        }
    });

    const wordList = [
        'áo', 'ấm', 'ăn', 'ắt', 'ăng', 'ả', 'ải', 'ấy', 'ảnh', 'ẩn', 'ảo', 'bão', 'báo', 'béo', 'bếp', 'bên', 'bị', 'bìa', 'bữa', 'bưởi', 'bụi', 'bút', 'cả', 'cải', 'cảm', 'canh', 'cắt', 'cây', 'cơm', 'cờ', 'cửa', 'cứu', 'cú', 'củ', 'chủ', 'chương', 'chuyện', 'chân', 'chim', 'chè', 'chở', 'chất', 'chứng', 'chân', 'chảy', 'dài', 'dân', 'dầu', 'dày', 'dẫn', 'đầy', 'đẹp', 'đất', 'đi', 'điều', 'điểm', 'điện', 'dở', 'đủ', 'dưỡng', 'em', 'én', 'êm', 'ép', 'ghế', 'giày', 'giấc', 'giúp', 'gìn', 'học', 'hát', 'hơn', 'họp', 'hợp', 'hệ', 'hiểu', 'hỏi', 'hoa', 'hủy', 'hứa', 'hóa', 'hành', 'hiện', 'hẳn', 'hãy', 'hoặc', 'hồn', 'hoàng', 'hôn', 'ích', 'in', 'ấn', 'kém', 'kêu', 'không', 'khi', 'khoẻ', 'khóa', 'khổ', 'kiên', 'kiến', 'kiểu', 'kiểm', 'kỹ', 'là', 'lá', 'lạ', 'lâu', 'lắm', 'lăn', 'lần', 'lớp', 'lịch', 'liền', 'lửa', 'lựa', 'lượng', 'lớn', 'lời', 'mát', 'máu', 'mặt', 'mây', 'mất', 'mẹ', 'mẻ', 'mùa', 'muộn', 'mừng', 'mỹ', 'mũi', 'nơi', 'nhỏ', 'nhận', 'nhớ', 'nhẹ', 'nhạc', 'nhiều', 'nhiệt', 'nhưng', 'như', 'nhẫn', 'nghỉ', 'ngủ', 'nghĩ', 'ngắn', 'người', 'ngày', 'ngọn', 'ngờ', 'ngụy', 'nặng', 'nóng', 'nước', 'nữa', 'nếu', 'nỗi', 'nở', 'nữ', 'ốc', 'ông', 'ốm', 'ớt', 'ơi', 'ổn', 'ôm', 'ôn', 'tổ', 'tổn', 'ưa', 'ức', 'ưng', 'ướt', 'ừ', 'ử', 'ừm', 'ủng', 'ủi', 'ước', 'ưỡn', 'ươm', 'ươn', 'oán', 'oằn', 'ôi', 'ôn', 'quá', 'quạt', 'quyết', 'quen', 'quyền', 'quê', 'quý', 'quốc', 'quên', 'quẩy', 'rạng', 'rỗi', 'rộng', 'rủi'
    ];

    let isSidebarCollapsed = false;
    let currentIndex = 0;
    let timer;
    let timeLeft = 60;
    let wordsTyped = 0;
    let currentText = [];
    let timerStartedOnFocusAndInput = false;
    let linesOfText = []; // Mảng chứa các hàng văn bản
    let currentLineIndex = 0; // Theo dõi hàng hiện tại đang gõ
    let currentWordIndexInLine = 0; // Theo dõi từ hiện tại trong hàng
    let wordSpacing; // Khai báo wordSpacing ở đây
    let totalKeyStrokes = 0;
    let totalCorrectChars = 0; // Tổng số ký tự đúng từ đầu bài
    let totalIncorrectChars = 0; // Tổng số ký tự sai từ đầu bài
    let startTime = null; // Thời điểm bắt đầu bài kiểm tra
    let finalWPM = 0;
    let finalAccuracy = 0;
    let currentStatisticsTabId = 'overview-tab';

    function getMaxLineWidth() {
        const wordDisplay = document.querySelector('.word-display');
        if (wordDisplay) {
            const paddingLeft = parseFloat(getComputedStyle(wordDisplay).paddingLeft) || 0;
            const paddingRight = parseFloat(getComputedStyle(wordDisplay).paddingRight) || 0;
            return wordDisplay.offsetWidth - paddingLeft - paddingRight;
        }
        return 680; // Giá trị mặc định nếu không tìm thấy wordDisplay
    }

    // Đo chiều rộng thực tế của khoảng trắng và cập nhật wordSpacing
    function getSpaceWidth() {
        if (!wordDisplay) {
            console.error('.word-display element is not available');
            return 0;
        }
        const tempSpan = document.createElement('span');
        tempSpan.style.fontFamily = getComputedStyle(wordDisplay).fontFamily;
        tempSpan.style.fontSize = getComputedStyle(wordDisplay).fontSize;
        tempSpan.innerText = 'a';
        tempSpan.style.position = 'absolute';
        tempSpan.style.left = '-9999px';
        document.body.appendChild(tempSpan);
        const width = tempSpan.offsetWidth;
        document.body.removeChild(tempSpan);
        return width;
    }

    const actualSpaceWidth = getSpaceWidth();
    wordSpacing = actualSpaceWidth; // Cập nhật wordSpacing với giá trị thực tế

    // Phần 2: Chức năng của Sidebar
    toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        mainContents.forEach(mainContent => {
            mainContent.classList.toggle('collapsed');
        });
        isSidebarCollapsed = !isSidebarCollapsed;
    });

    function showPage(pageId) {
        mainContents.forEach(page => {
            page.classList.remove('active');
            page.style.display = 'none';
        });
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
            targetPage.style.display = 'flex';
            if (pageId === 'typing-page') {
                initTypingGame();
                typingInput.focus();
            } else if (pageId === 'statistics-page') {
                updateStatisticsDisplay();
            }
        }

        sidebarLinks.forEach(link => {
            link.parentElement.classList.remove('active');
            const hrefWithoutHash = link.getAttribute('href').substring(1);
            const pageIdWithoutPage = pageId.replace('-page', '');
            if (hrefWithoutHash === pageIdWithoutPage) {
                link.parentElement.classList.add('active');
            }
        });
    }

    // Gọi showPage cho trang chủ khi tải trang lần đầu
    showPage('home-page');

    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ <a>
            const targetPageId = this.getAttribute('href').substring(1) + '-page';
            showPage(targetPageId);
        });
    });

    // Phần 3: Chức năng của Hero Slider
    function goToSlide(index) {
        if (index < 0) {
            currentIndex = slides.length - 1;
        } else if (index >= slides.length) {
            currentIndex = 0;
        } else {
            currentIndex = index;
        }

        slides.forEach((slide, i) => {
            slide.style.transform = `translateX(${(i - currentIndex) * 100}%)`;
        });

        indicators.forEach(indicator => indicator.classList.remove('active'));
        if (indicators[currentIndex]) {
            indicators[currentIndex].classList.add('active');
        }
    }

    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    function prevSlide() {
        goToSlide(currentIndex - 1);
    }

    function goToIndicator(index) {
        goToSlide(index);
    }

    // Phần 4: Chức năng Luyện Gõ (Đã sửa lỗi tính WPM và theo dõi tổng số ký tự)

    function getRandomWord() {
        const randomIndex = Math.floor(Math.random() * wordList.length);
        return wordList[randomIndex];
    }

    function getTextWidth(text, location) {
        const tempSpan = document.createElement('span');
        const styleToCopy = getComputedStyle(location);

        tempSpan.style.fontFamily = styleToCopy.fontFamily;
        tempSpan.style.fontSize = styleToCopy.fontSize;
        tempSpan.style.letterSpacing = styleToCopy.letterSpacing;
        tempSpan.style.wordSpacing = styleToCopy.wordSpacing;
        tempSpan.style.fontVariant = styleToCopy.fontVariant;
        tempSpan.style.textTransform = styleToCopy.textTransform;

        tempSpan.style.position = 'absolute';
        tempSpan.style.whiteSpace = 'nowrap';
        tempSpan.style.top = '-9999px';
        tempSpan.style.left = '-9999px';

        tempSpan.innerText = text;

        location.appendChild(tempSpan);
        const width = tempSpan.offsetWidth;
        location.removeChild(tempSpan);

        return width;
    }

    function generateLineOfText() {
        let wordLineList = [];
        let listWidth = 100;
        const maxWidth = getMaxLineWidth();

        while (true) {
            const newWord = getRandomWord();
            const wordWidth = getTextWidth(newWord, wordDisplay);

            const potentialWidth = listWidth + (wordLineList.length > 0 ? wordSpacing : 0) + wordWidth;

            if (potentialWidth >= maxWidth) {
                break;
            } else {
                wordLineList.push(newWord);
                listWidth = potentialWidth;
            }
            if (wordLineList.length > 50) {
                break;
            }
        }
        return wordLineList;
    }

    function displayLines() {
        wordDisplay.innerHTML = '';
        linesOfText.forEach(line => {
            const lineDiv = document.createElement('div');
            lineDiv.classList.add('word-line');
            line.forEach((word, index) => {
                const wordSpan = document.createElement('span');
                wordSpan.innerText = word;
                lineDiv.appendChild(wordSpan);
                if (index < line.length - 1) {
                    lineDiv.appendChild(document.createTextNode(' '));
                }
            });
            wordDisplay.appendChild(lineDiv);
        });
        if (wordDisplay.firstChild && wordDisplay.firstChild.firstChild) {
            wordDisplay.firstChild.firstChild.classList.add('active');
        }
        currentText = linesOfText[0] || [];
        currentWordIndexInLine = 0;
    }

    function initTypingGame() {

        totalKeyStrokes = 0;
        totalCorrectChars = 0;
        totalIncorrectChars = 0;
        typingInput.value = '';
        typingInput.disabled = false;
        wordDisplay.innerHTML = '';
        resultsSection.style.display = 'none';
        wpmDisplay.innerText = 0;
        accuracyDisplay.innerText = '0%';
    
        // Thiết lập giá trị mặc định cho thời gian tùy chỉnh nếu chưa tồn tại
        if (localStorage.getItem(DURATION_KEY + '_custom') === null) {
            localStorage.setItem(DURATION_KEY + '_custom', '60');
        }
    
        // Lấy giá trị thời gian từ localStorage
        const durationType = getTypingSetting(DURATION_KEY + '_type', '1').trim().toLowerCase();
        const customSecondsString = getTypingSetting(DURATION_KEY + '_custom', '60'); // Giá trị mặc định là 60
        const customSeconds = parseInt(customSecondsString, 10) || 60;
    
        if (durationType === 'custom') {
            timeLeft = customSeconds;
            if (timeLeft <= 0) {
                timeLeft = 60; // Giá trị mặc định nếu không hợp lệ
                alert('Thời gian tùy chỉnh không hợp lệ, sử dụng 60 giây.');
            }
        } else {
            timeLeft = parseInt(durationType, 10) * 60; // Chuyển phút sang giây
        }
        timeDisplay.innerText = timeLeft;
    
        currentWordIndexInLine = 0;
    
        linesOfText = [];
        const initialLines = 3;
        for (let i = 0; i < initialLines; i++) {
            linesOfText.push(generateLineOfText());
        }
        displayLines();
    
        clearInterval(timer);
        timer = null;
        timerStartedOnFocusAndInput = false;
        wordDisplay.scrollTop = 0;
        typingInput.addEventListener('input', handleInput);
        typingInput.addEventListener('keydown', handleKeyDown);
        startTime = null;
    }    

    function calculateWPM() {
        if (!startTime || totalCorrectChars === 0) return 0;
        const endTime = new Date().getTime();
        const elapsedSeconds = (endTime - startTime) / 1000;
        const elapsedMinutes = elapsedSeconds / 60;
        const wordsTyped = totalCorrectChars / 5; // Ước tính số từ
        return elapsedMinutes > 0 ? Math.max(0, Math.floor(wordsTyped / elapsedMinutes)) : 0;
    }

    function calculateAccuracy() {
        if (totalKeyStrokes === 0) return 0;
        return Math.round((totalCorrectChars / totalKeyStrokes) * 100); // Accuracy dựa trên tổng số lần gõ phím
    }

    function handleKeyDown(event) {
        if (event.key === 'Backspace' && typingInput.value.length !== 0) {
            totalKeyStrokes++;
        }
        if (!timerStartedOnFocusAndInput && document.activeElement === typingInput && typingInput.value.length > 0 && startTime === null) {
            startTime = new Date().getTime();
            timer = setInterval(updateTimer, 1000);
            timerStartedOnFocusAndInput = true;
        }
    }

    function updateTimer() {
        if (timeLeft > 0) {
            timeLeft--;
            timeDisplay.innerText = timeLeft;
            // Cập nhật WPM và Accuracy trong khi đếm ngược (tùy chọn)
            wpmDisplay.innerText = calculateWPM();
            accuracyDisplay.innerText = calculateAccuracy();
        } else {
            clearInterval(timer);
            typingInput.disabled = true;
            endGame();
        }
    }

    function handleInput() {
    
        // Phần 1: Khởi động bộ đếm thời gian
        if (!timerStartedOnFocusAndInput && document.activeElement === typingInput && typingInput.value.length > 0 && startTime === null) {
            startTime = new Date().getTime();
            timer = setInterval(updateTimer, 1000);
            timerStartedOnFocusAndInput = true;
        }
    
        // Phần 2: Lấy thông tin hiện tại
        const typedValue = typingInput.value;
        const currentLine = wordDisplay.childNodes[0]; // Hàng hiện tại luôn là hàng đầu tiên
        const currentWord = currentText[currentWordIndexInLine];
        const currentWordSpan = currentLine ? currentLine.childNodes[currentWordIndexInLine * 2] : null;
    
        if (!currentLine || !currentWordSpan) return;
    
        // Phần 3: Xử lý ký tự đã nhập trong từ hiện tại
        let currentCorrectCharsInWord = 0;
    
        currentWordSpan.innerHTML = '';
        let expectedWord = currentWord || '';
        for (let i = 0; i < Math.max(typedValue.length, expectedWord.length); i++) {
            const typedChar = typedValue[i];
            const expectedChar = expectedWord[i];
            const charSpan = document.createElement('span');
            charSpan.innerText = expectedChar || '';
    
            // Chỉ đánh dấu đúng/sai khi isTypoShown là true
            if (isTypoShown) {
                if (typedChar === expectedChar) {
                    charSpan.className = 'correct';
                    currentCorrectCharsInWord++;
                    if (isSoundEnabled) {
                        playSound(correctSound, 1);
                    }
                } else if (typedChar !== undefined) {
                    charSpan.className = 'incorrect';
                    if (isSoundEnabled) {
                        playSound(incorrectSound, 0.05);
                    }
                }
            } else {
                if (isSoundEnabled) {
                    playSound(correctSound);
                }
            }
            currentWordSpan.appendChild(charSpan);
        }
    
        // Phần 4: Xử lý khi hoàn thành một từ (gõ dấu cách)
        if (typedValue.endsWith(' ')) {
            const typedWord = typedValue.trim();
            if (typedWord !== '') {
                wordsTyped++;
                totalKeyStrokes += typedWord.length;
    
                let correctCharsInWordForStats = 0;
                for (let i = 0; i < Math.min(typedWord.length, expectedWord.length); i++) {
                    if (typedWord[i] === expectedWord[i]) {
                        correctCharsInWordForStats++;
                    }
                }
                if (expectedWord === typedWord) {
                    totalCorrectChars += typedWord.length;
                } else {
                    totalCorrectChars += correctCharsInWordForStats;
                    totalIncorrectChars += (typedWord.length - correctCharsInWordForStats);
                }
    
                const typedWordSpan = currentLine.childNodes[currentWordIndexInLine * 2];
                if (typedWordSpan) {
                    typedWordSpan.classList.add('completed');
                    if (isTypoShown) {
                        typedWordSpan.innerHTML = ''; // Reset innerHTML để re-render highlight
                        for (let i = 0; i < expectedWord.length; i++) {
                            const span = document.createElement('span');
                            span.innerText = expectedWord[i];
                            if (typedWord[i] === expectedWord[i]) {
                                span.className = 'correct';
                            } else if (typedWord[i] !== undefined) {
                                span.className = 'incorrect';
                            } else {
                                span.className = 'incomplete'; // Class cho ký tự chưa gõ tới
                            }
                            typedWordSpan.appendChild(span);
                        }
                        if (typedWord.length > expectedWord.length) {
                            typedWordSpan.classList.add('incorrect-length');
                        } else if (typedWord.length < expectedWord.length && typedWord !== expectedWord.substring(0, typedWord.length)) {
                            typedWordSpan.classList.add('incorrect-length');
                        }
                    } else {
                        // Khi tắt hiển thị lỗi, đảm bảo không có class đúng/sai
                        typedWordSpan.innerHTML = expectedWord;
                    }
                }
    
                typingInput.value = '';
                currentWordIndexInLine++;
    
                if (currentWordIndexInLine >= currentText.length) {
                    // Đã gõ hết hàng hiện tại
                    linesOfText.shift(); // Xóa hàng đầu tiên
                    wordDisplay.removeChild(wordDisplay.firstChild); // Xóa hàng đầu tiên khỏi DOM
    
                    const newLine = generateLineOfText();
                    linesOfText.push(newLine); // Thêm hàng mới xuống cuối
                    const newLineDiv = document.createElement('div');
                    newLineDiv.classList.add('word-line');
                    newLine.forEach((word, index) => {
                        const wordSpan = document.createElement('span');
                        wordSpan.innerText = word;
                        newLineDiv.appendChild(wordSpan);
                        if (index < newLine.length - 1) {
                            newLineDiv.appendChild(document.createTextNode(' '));
                        }
                    });
                    wordDisplay.appendChild(newLineDiv);
    
                    currentWordIndexInLine = 0; // Reset về từ đầu tiên của hàng mới
                    currentText = linesOfText[0] || [];
    
                    // Đảm bảo từ đầu tiên của hàng mới có class 'active'
                    if (wordDisplay.firstChild && wordDisplay.firstChild.firstChild) {
                        wordDisplay.firstChild.firstChild.classList.add('active');
                    }
    
                    wordDisplay.scrollTop = 0; // Đảm bảo scroll về đầu để thấy hàng mới
                } else {
                    // Chuyển sang từ tiếp theo trong hàng
                    if (currentLine && currentLine.childNodes[currentWordIndexInLine * 2]) {
                        currentLine.childNodes[currentWordIndexInLine * 2].classList.add('active');
                    }
                }
            } else {
                typingInput.value = ''; // Xóa dấu cách thừa
            }
        } else {
            // Phần 5: Xử lý khi người dùng xóa bớt ký tự trong từ đang gõ
            if (typedValue.length < expectedWord.length && currentWordSpan) {
                currentWordSpan.innerHTML = '';
                for (let i = 0; i < typedValue.length; i++) {
                    const charSpan = document.createElement('span');
                    charSpan.innerText = expectedWord[i] || '';
                    if (isTypoShown && typedValue[i] === expectedWord[i]) {
                        charSpan.className = 'correct';
                    } else if (isTypoShown && typedValue[i] !== undefined) {
                        charSpan.className = 'incorrect';
                    }
                    currentWordSpan.appendChild(charSpan);
                }
                for (let i = typedValue.length; i < expectedWord.length; i++) {
                    const charSpan = document.createElement('span');
                    charSpan.innerText = expectedWord[i];
                    currentWordSpan.appendChild(charSpan);
                }
            }
        }
    
        // Phần 6: Cập nhật hiển thị WPM và Accuracy
        wpmDisplay.innerText = calculateWPM();
        accuracyDisplay.innerText = calculateAccuracy();
    }


    function endGame() {
        
        clearInterval(timer); // Dừng timer
        timer = null; // Đặt timer về null để tránh gọi lại ngoài ý muốn
        typingInput.disabled = true;
        
        const endTime = new Date().getTime();
        const elapsedSeconds = Math.round((endTime - startTime) / 1000);
        const wpm = calculateWPM();
        const accuracy = calculateAccuracy();
        finalWPM = wpm;
        finalAccuracy = accuracy;
    
        // Lấy loại thời gian và giá trị thời gian
        const durationType = getTypingSetting(DURATION_KEY + '_type', '1').trim().toLowerCase();
        let durationLabel = '';
        let actualDuration = 0; // Thời lượng thực tế của bài kiểm tra
    
        if (durationType === 'custom') {
            const customSeconds = parseInt(getTypingSetting(DURATION_KEY + '_custom', '60'), 10) || 60;
            durationLabel = `Tùy chỉnh (${customSeconds} giây)`;
            actualDuration = elapsedSeconds; // Thời lượng thực tế đã trôi qua
        } else {
            durationLabel = `${durationType} phút`;
            actualDuration = timeLeft; // Thời lượng ban đầu
        }
    
        const historyEntry = {
            date: new Date(),
            wpm: wpm,
            accuracy: Number(accuracy),
            duration: actualDuration,
            durationTypeLabel: durationLabel,
            timestamp: startTime,
        };
    
        let history = getTypingHistory();
        history.push(historyEntry);
        localStorage.setItem(TYPING_HISTORY_KEY, JSON.stringify(history));
    
        displayResults(); 
        updateStatisticsDisplay();
    }     

    function displayResults() {
        resultsSection.style.display = 'flex';
        finalWpmDisplay.innerText = finalWPM;
        finalAccuracyDisplay.innerText = finalAccuracy + '%';
        totalCharsDisplay.innerText = totalKeyStrokes;
        correctCharsDisplay.innerText = totalCorrectChars;
        incorrectCharsDisplay.innerText = totalIncorrectChars;
    }

    restartButton.addEventListener('click', initTypingGame);

    // Phần 5: Chức năng Thống kê
    const TYPING_HISTORY_KEY = 'typingHistory';
    const HISTORY_PAGE_SIZE = 8; // Số mục lịch sử hiển thị trên mỗi trang
    let currentPage = 1; // Trang hiện tại
    let totalPages = 1; // Tổng số trang
    const paginationDiv = document.getElementById('pagination'); // Phần tử div chứa các nút phân trang

    function getTypingHistory() {
        const historyString = localStorage.getItem(TYPING_HISTORY_KEY);
        return historyString ? JSON.parse(historyString) : [];
    }
    
    function saveTypingHistory(history) {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    }

    function showTab(tabId) {
        const tabContents = document.querySelectorAll('.tab-content');
        const buttons = document.querySelectorAll('.tab-button');

        tabContents.forEach(content => content.classList.remove('active'));
        buttons.forEach(button => button.classList.remove('active'));

        document.getElementById(tabId).classList.add('active');
        const activeButton = Array.from(buttons).find(button => button.getAttribute('data-tab') === tabId.replace('-tab', ''));
        if (activeButton) {
            activeButton.classList.add('active');
        }

        currentStatisticsTabId = tabId;

        switch(tabId) {
            case 'history-tab':
                const history = getTypingHistory();
                displayHistory(history, history.length === 0, 1);
                break;
            case 'overview-tab':
                displayOverview();
                break;
        }
    }

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab') + '-tab';
            showTab(tabId);
            updateStatisticsDisplay(); // Cập nhật lại dữ liệu khi chuyển tab (nếu cần)
        });
    });

    
    function updateStatisticsDisplay() {
        // Cập nhật tab Lịch sử
        switch (currentStatisticsTabId) {
            case 'history-tab':
                const history = getTypingHistory();
                displayHistory(history, history.length === 0);
                break;
            case 'overview-tab':
                displayOverview();
                break;
        }
    }

    function displayOverview() {
        const history = getTypingHistory();
        // Lấy các phần tử HTML cần thiết
        const averageWpmDisplay = document.getElementById('average-wpm');
        const averageAccuracyDisplay = document.getElementById('average-accuracy');
        const averageTimeDisplay = document.getElementById('average-time');
    
        // Cập nhật tab Tổng quan
        if (history.length === 0) {
            averageWpmDisplay.textContent = '--';
            averageAccuracyDisplay.textContent = '--';
            averageTimeDisplay.textContent = '--';
        } else {
            let totalTimeInSeconds = 0; // Sử dụng biến mới để tính tổng thời gian

            history.forEach(entry => {
                let entryDurationInSeconds = 0;
            
                if (entry.durationTypeLabel) {
                    const label = entry.durationTypeLabel.toLowerCase();
            
                    if (label.includes('phút')) {
                        const minutes = parseInt(label.split(' ')[0], 10) || 0;
                        entryDurationInSeconds = minutes * 60;
                    } else if (label.includes('tùy chỉnh')) {
                        const match = label.match(/^tùy chỉnh\s*\((\d+)\s*giây\)$/);
                        if (match) {
                            entryDurationInSeconds = parseInt(match[1], 10) || 0;
                        }
                    } else if (label.includes('giây') && !label.includes('tùy chỉnh')) {
                        entryDurationInSeconds = parseInt(label.split(' ')[0], 10) || 0;
                    }
                } else if (entry.duration) {
                    entryDurationInSeconds = entry.duration;
                }
            
                totalTimeInSeconds += entryDurationInSeconds;
            });

            // Tính toán các giá trị thống kê
            const totalWPM = history.reduce((sum, entry) => sum + (entry.wpm || 0), 0);
            const averageWPM = history.length > 0 ? Math.round(totalWPM / history.length) : 0;
    
            const validAccuracyEntries = history.filter(entry => typeof entry.accuracy === 'number');
            const totalAccuracy = validAccuracyEntries.reduce((sum, entry) => sum + (entry.accuracy || 0), 0);
            const averageAccuracy = validAccuracyEntries.length > 0
                ? (totalAccuracy / validAccuracyEntries.length).toFixed(0) + '%'
                : '0%';
    
            const averageTimeInSeconds = history.length > 0 ? totalTimeInSeconds / history.length : 0;

            const minutes = Math.floor(averageTimeInSeconds / 60);
            const seconds = Math.round(averageTimeInSeconds % 60);
    
            let averageTimeText = '';
            if (minutes > 0) {
                averageTimeText += minutes + ' <span class="unit">phút</span> ';
            }
            if (seconds > 0 || minutes === 0) {
                averageTimeText += seconds + ' <span class="average-time-unit">giây</span>';
            }
    
            averageTimeDisplay.innerHTML = averageTimeText; // Sử dụng innerHTML để thêm span
            averageWpmDisplay.textContent = averageWPM;
            averageAccuracyDisplay.textContent = averageAccuracy;
        }
    }

    historyFilterDateInput.addEventListener('change', filterAndSortHistory);
    historySortBySelect.addEventListener('change', filterAndSortHistory);

    function filterAndSortHistory() {
        try {
            const history = getTypingHistory();
            if (history.length === 0) {
                displayHistory(history, 1);
                return;
            }
            let filteredHistory = [...history];

            // Lọc theo ngày
            const selectedDate = historyFilterDateInput.value;
            if (selectedDate) {
                filteredHistory = filteredHistory.filter(entry => {
                    let entryDate;
                    let entryDateString;
                    if (entry.timestamp) {
                        entryDate = new Date(entry.timestamp);
                        entryDateString = entryDate.toISOString().split('T')[0];
                    } else if (entry.date) {
                        entryDate = new Date(entry.date);
                        entryDateString = entryDate.toISOString().split('T')[0];
                    } else {
                        console.warn("Entry missing timestamp and date:", entry);
                        return false; // Bỏ qua mục nếu không có ngày tháng
                    }
                    return entryDateString === selectedDate;
                });
            }

            // Sắp xếp
            const sortBy = historySortBySelect.value;

            switch (sortBy) {
                case 'time':
                    filteredHistory.sort((a, b) => {
                        const dateA = a.timestamp ? new Date(a.timestamp) : a.date ? new Date(a.date) : null;
                        const dateB = b.timestamp ? new Date(b.timestamp) : b.date ? new Date(b.date) : null;

                        if (!dateA || !dateB) {
                            console.warn("Entry missing timestamp or date for sorting:", a, b);
                            return 0; // Giữ nguyên thứ tự nếu thiếu ngày tháng
                        }
                        return dateA - dateB;
                    });
                    break;
                case 'wpm':
                    filteredHistory.sort((a, b) => {
                        const wpmA = Number(a.wpm) || 0;
                        const wpmB = Number(b.wpm) || 0;
                        return wpmB - wpmA;
                    });
                    break;
                case 'accuracy':
                    filteredHistory.sort((a, b) => {
                        const accuracyA = Number(a.accuracy) || 0;
                        const accuracyB = Number(b.accuracy) || 0;
                        return accuracyB - accuracyA;
                    });
                    break;
            }

            displayHistory(filteredHistory);

        } catch (error) {
            console.error("Lỗi trong filterAndSortHistory:", error);
            // Xử lý lỗi (ví dụ: hiển thị thông báo cho người dùng)
        }
    }

    function createPaginationButtons(history, currentPage) {
        const totalPages = Math.ceil(history.length / HISTORY_PAGE_SIZE);
    
        if (totalPages <= 1) return;
    
        const paginationDiv = document.getElementById('pagination');
        paginationDiv.innerHTML = '';
    
        let pageButtons = []; // Lưu trữ các nút trang để dễ dàng thao tác
    
        // Nút "Trước"
        if (currentPage > 1) {
            const prevButton = document.createElement('button');
            prevButton.textContent = 'Trước';
            prevButton.addEventListener('click', () => {
                displayHistory(history, 0, currentPage - 1);
                updateActiveButton(pageButtons, currentPage - 1); // Cập nhật active
            });
            paginationDiv.appendChild(prevButton);
        }
    
        // Các nút số
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            pageButtons.push(pageButton); // Thêm vào mảng
    
            if (i === currentPage) {
                pageButton.classList.add('active');
            }
    
            pageButton.addEventListener('click', () => {
                displayHistory(history, 0, i);
                updateActiveButton(pageButtons, i); // Cập nhật active
            });
            paginationDiv.appendChild(pageButton);
        }
    
        // Nút "Sau"
        if (currentPage < totalPages) {
            const nextButton = document.createElement('button');
            nextButton.textContent = 'Sau';
            nextButton.addEventListener('click', () => {
                displayHistory(history, 0, currentPage + 1);
                updateActiveButton(pageButtons, currentPage + 1); // Cập nhật active
            });
            paginationDiv.appendChild(nextButton);
        }
    }
    
    function updateActiveButton(buttons, activePage) {
        buttons.forEach(button => button.classList.remove('active'));
        buttons[activePage - 1].classList.add('active');
    }
    
    function displayHistory(history, isHistoryNull = 0, page = 1) {
        
        if (isHistoryNull) {
            historyFilters.forEach(historyFilter => {
                historyFilter.style.display = 'none';
            });
            historyTable.style.display = 'none';
            noDataMessage.style.display = 'block';
            return;
        }

        console.log("Giá trị của history:", history); // Thêm dòng này

        historyTableBody.innerHTML = ''; // Xóa dữ liệu cũ trước khi hiển thị mới
    
        if (history.length === 0) {
            historyTableBody.innerHTML = 'Không có dữ liệu';
        } 

        historyFilters.forEach(historyFilter => historyFilter.style.display = 'flex');
        historyTable.style.display = 'table';
        noDataMessage.style.display = 'none';

        const startIndex = (page - 1) * HISTORY_PAGE_SIZE;
        const endIndex = startIndex + HISTORY_PAGE_SIZE;
        const pageHistory = history.slice(startIndex, endIndex);
        
        pageHistory.forEach(entry => {
            let dateString = 'Invalid Date';
            if (entry.timestamp) {
                dateString = new Date(entry.timestamp).toLocaleString();
            } else if (entry.date) {
                dateString = new Date(entry.date).toLocaleString();
            }
    
            let durationText = '';
            if (entry.durationTypeLabel && entry.durationTypeLabel.toLowerCase().startsWith('tùy chỉnh')) {
                durationText = entry.durationTypeLabel;
            } else if (entry.durationTypeLabel) {
                durationText = entry.durationTypeLabel;
            } else {
                durationText = `${Math.round(entry.duration) || 0} giây`;
            }
    
            const row = historyTableBody.insertRow();
            const timeCell = row.insertCell();
            const wpmCell = row.insertCell();
            const accuracyCell = row.insertCell();
            const modeCell = row.insertCell();
            const detailsCell = row.insertCell();
    
            timeCell.textContent = dateString;
            wpmCell.textContent = entry.wpm || 'N/A';
            accuracyCell.textContent = (typeof entry.accuracy === 'number') ? entry.accuracy.toFixed(0) + '%' : 'N/A';
            modeCell.textContent = durationText; // HIỂN THỊ DURATION_TEXT Ở ĐÂY
            detailsCell.innerHTML = `<button class="view-details-btn" data-entry='${JSON.stringify(entry)}'>Xem chi tiết</button>`;
        });
    
        const detailButtons = document.querySelectorAll('.view-details-btn');
        detailButtons.forEach(button => {
            button.addEventListener('click', function() {
                const entryData = JSON.parse(this.getAttribute('data-entry'));
                displaySessionDetails(entryData);
            });
        });
        createPaginationButtons(history, page);
    }

    function displaySessionDetails(entry) {
        // code hiển thị chi tiết session
        alert(`Chi tiết phiên:\nThời gian: ${new Date(entry.timestamp).toLocaleString()}\nWPM: ${entry.wpm}\nĐộ chính xác: ${entry.accuracy}%`);
    }

    // Gọi updateStatisticsDisplay khi trang Thống kê được hiển thị
    // Phần 6: Xử lý sự kiện chung và khởi tạo

    // Thêm event listeners cho các nút điều khiển slider và indicator
    if (prevButton) prevButton.addEventListener('click', prevSlide);
    if (nextButton) nextButton.addEventListener('click', nextSlide);
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => goToIndicator(index));
    });

    // Xử lý sự kiện click trên các nút "slide-button" để chuyển trang
    const slideButtons = document.querySelectorAll('.slide-button');
    slideButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            const targetPageId = this.getAttribute('data-target');
            showPage(targetPageId + '-page');
        });
    });

    // Gọi showPage cho trang chủ khi tải trang lần đầu
    showPage('home-page');

    // Khởi tạo slider
    goToSlide(0);

    // Khởi tạo trò chơi gõ phím khi trang typing được hiển thị lần đầu tiên
    const typingPageLink = Array.from(sidebarLinks).find(link => link.getAttribute('href') === '#typing');
    if (typingPageLink) {
        typingPageLink.addEventListener('click', () => {
            showPage('typing-page');
        });
    }
});
