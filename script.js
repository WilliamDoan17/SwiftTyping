document.addEventListener('DOMContentLoaded', function() {
// Phần 1: Khai báo các biến và hằng số
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
    const showTypoSwitch = document.getElementById('show-typo-switch');
    let isTypoShown = getTypingSetting(SHOW_TYPO_KEY, 'true') === 'true';

    function saveTypingSetting(key, value) {
        localStorage.setItem(key, value);
    }
    
    function getTypingSetting(key, defaultValue) {
        return localStorage.getItem(key) || defaultValue;
    }
    
    if (showTypoSwitch) {
        showTypoSwitch.checked = isTypoShown;
        showTypoSwitch.addEventListener('change', function() {
            const isChecked = this.checked;
            saveTypingSetting(SHOW_TYPO_KEY, isChecked);
            isTypoShown = isChecked; // Cập nhật trực tiếp biến isTypoShown
            console.log('Trạng thái hiển thị lỗi đã được lưu và cập nhật:', isChecked);
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

        // Lấy giá trị thời gian từ localStorage
        const durationType = getTypingSetting(DURATION_KEY + '_type', '1').trim().toLowerCase();
        const customSecondsString = getTypingSetting(DURATION_KEY + '_custom', '60');
        const customSeconds = parseInt(customSecondsString, 10) || 60; // Chuyển sang số, mặc định 60 nếu lỗi

        console.log('Giá trị typingDuration_custom khi init:', customSecondsString);
        console.log('Giá trị typingDuration_type khi init:', durationType);
        console.log('Giá trị customSeconds sau parseInt:', customSeconds);

        if (durationType === 'custom') {
            timeLeft = customSeconds;
            console.log('timeLeft (inside custom):', timeLeft);
            if (timeLeft <= 0) {
                timeLeft = 60; // Giá trị mặc định nếu không hợp lệ
                alert('Thời gian tùy chỉnh không hợp lệ, sử dụng 60 giây.');
                console.log('timeLeft (custom invalid, reset to 60):', timeLeft);
            }
        } else {
            timeLeft = parseInt(durationType, 10) * 60; // Chuyển phút sang giây
            console.log('timeLeft (fixed duration):', timeLeft);
        }
        console.log('timeLeft (final):', timeLeft);
        timeDisplay.innerText = timeLeft;

        currentWordIndexInLine = 0;
        currentLineIndex = 0;

        linesOfText = [];
        for (let i = 0; i < 3; i++) {
            linesOfText.push(generateLineOfText());
        }
        displayLines();

        clearInterval(timer);
        timer = null;
        timerStartedOnFocusAndInput = false;
        wordDisplay.scrollTop = 0;
        typingInput.addEventListener('input', handleInput);
        typingInput.addEventListener('keydown', handleKeyDown);
        startTime = null; // Reset startTime khi bắt đầu trò chơi mới
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
        if (totalKeyStrokes === 0) return '0%';
        return Math.round((totalCorrectChars / totalKeyStrokes) * 100) + '%'; // Accuracy dựa trên tổng số lần gõ phím
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
        console.log('isTypoShown:', isTypoShown); // Kiểm tra giá trị của isTypoShown
    
        if (!timerStartedOnFocusAndInput && document.activeElement === typingInput && typingInput.value.length > 0 && startTime === null) {
            startTime = new Date().getTime();
            timer = setInterval(updateTimer, 1000);
            timerStartedOnFocusAndInput = true;
        }
    
        const typedValue = typingInput.value;
        const currentLine = wordDisplay.childNodes[currentLineIndex];
        const currentWord = currentText[currentWordIndexInLine];
        const currentWordSpan = currentLine ? currentLine.childNodes[currentWordIndexInLine * 2] : null;
    
        if (!currentLine || !currentWordSpan) return;
    
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
                } else if (typedChar !== undefined) {
                    charSpan.className = 'incorrect';
                }
            }
            currentWordSpan.appendChild(charSpan);
        }
    
        if (typedValue.endsWith(' ')) {
            const typedWord = typedValue.trim();
            if (typedWord !== '') {
                wordsTyped++;
                totalKeyStrokes += typedWord.length; // Chỉ tăng khi hoàn thành từ
    
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
                    currentLineIndex++;
                    currentWordIndexInLine = 0;
                    if (currentLineIndex < linesOfText.length) {
                        currentText = linesOfText[currentLineIndex];
                        const nextLine = wordDisplay.childNodes[currentLineIndex];
                        if (nextLine && nextLine.firstChild) {
                            nextLine.firstChild.classList.add('active');
                        }
                        wordDisplay.scrollTop = nextLine ? nextLine.offsetTop : wordDisplay.scrollHeight;
                    } else {
                        clearInterval(timer);
                        typingInput.disabled = true;
                        endGame();
                    }
                }
                if (currentLine && currentLine.childNodes[currentWordIndexInLine * 2]) {
                    currentLine.childNodes[currentWordIndexInLine * 2].classList.add('active');
                }
            } else {
                // Xử lý khi người dùng xóa bớt ký tự trong từ đang gõ
                if (typedValue.length < expectedWord.length && currentWordSpan) {
                    currentWordSpan.innerHTML = '';
                    for (let i = 0; i < typedValue.length; i++) {
                        const charSpan = document.createElement('span');
                        charSpan.innerText = expectedWord[i] || '';
                        currentWordSpan.appendChild(charSpan);
                    }
                    for (let i = typedValue.length; i < expectedWord.length; i++) {
                        const charSpan = document.createElement('span');
                        charSpan.innerText = expectedWord[i];
                        currentWordSpan.appendChild(charSpan);
                    }
                }
            }
        }
    
        wpmDisplay.innerText = calculateWPM();
        accuracyDisplay.innerText = calculateAccuracy();
    }

    function endGame() {
        clearInterval(timer);
        typingInput.disabled = true;
        const endTime = new Date().getTime();
        const timeTakenSeconds = (endTime - startTime) / 1000;
        // const timeTakenMinutes = timeTakenSeconds / 60; // Không cần dùng trực tiếp ở đây

        const wordsTypedFinal = totalCorrectChars / 5;
        finalWPM = Math.round(wordsTypedFinal / (timeTakenSeconds / 60)) || 0; // Tính WPM dựa trên giây
        finalAccuracy = calculateAccuracy();

        finalWpmDisplay.innerText = finalWPM;
        finalAccuracyDisplay.innerText = finalAccuracy;
        totalCharsDisplay.innerText = totalKeyStrokes;
        correctCharsDisplay.innerText = totalCorrectChars;
        incorrectCharsDisplay.innerText = totalIncorrectChars;
        resultsSection.style.display = 'block';

        const history = getTypingHistory();
        const durationType = getTypingSetting(DURATION_KEY + '_type', '1');
        const customDuration = getTypingSetting(DURATION_KEY + '_custom', '');

        let durationLabel = '';
        if (durationType.toLowerCase() === 'custom') {
            durationLabel = `Tùy chỉnh (${customDuration} giây)`;
        } else if (durationType === '1') {
            durationLabel = '1 phút';
        } else if (durationType === '2') {
            durationLabel = '2 phút';
        } else if (durationType === '3') {
            durationLabel = '3 phút';
        } else if (durationType === '5') {
            durationLabel = '5 phút';
        } else {
            durationLabel = `${parseInt(durationType, 10)} phút`; // Xử lý các giá trị cố định khác
        }

        console.log('Giá trị timeTakenSeconds khi endGame:', timeTakenSeconds); // Thêm console.log()
        console.log('Giá trị durationType khi endGame:', durationType); // Thêm console.log()
        console.log('Giá trị customDuration khi endGame:', customDuration); // Thêm console.log()
        console.log('Giá trị durationLabel khi endGame:', durationLabel); // Thêm console.log()

        history.push({
            timestamp: new Date().toISOString(),
            wpm: finalWPM,
            accuracy: parseFloat(finalAccuracy.slice(0, -1)),
            duration: timeTakenSeconds, // Lưu tổng số giây
            durationTypeLabel: durationLabel,
            totalKeystrokes: totalKeyStrokes,
            correctKeystrokes: totalCorrectChars,
            incorrectKeystrokes: totalIncorrectChars
        });
        saveTypingHistory(history);
    }

    restartButton.addEventListener('click', initTypingGame);

    // Phần 5: Chức năng Thống kê
    const HISTORY_KEY = 'typingHistory';

    function getTypingHistory() {
        const historyString = localStorage.getItem(HISTORY_KEY);
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
    }

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab') + '-tab';
            showTab(tabId);
            updateStatisticsDisplay(); // Cập nhật lại dữ liệu khi chuyển tab (nếu cần)
        });
    });

    function updateStatisticsDisplay() {
        const history = getTypingHistory();

        // Cập nhật tab Tổng quan
        overviewTab.innerHTML = '<h3>Tổng quan</h3>';
        if (history.length === 0) {
            overviewTab.innerHTML += '<p>Chưa có dữ liệu luyện tập nào.</p>';
        } else {
            const totalWPM = history.reduce((sum, entry) => sum + (entry.wpm || 0), 0);
            const averageWPM = history.length > 0 ? Math.round(totalWPM / history.length) : 0;

            const totalAccuracy = history.reduce((sum, entry) => sum + (entry.accuracy || 0), 0);
            const averageAccuracy = history.length > 0 ? (totalAccuracy / history.length).toFixed(2) + '%' : '0%';

            const totalSessions = history.length;

            overviewTab.innerHTML += `<p><strong>WPM trung bình:</strong> ${averageWPM}</p>`;
            overviewTab.innerHTML += `<p><strong>Độ chính xác trung bình:</strong> ${averageAccuracy}</p>`;
            overviewTab.innerHTML += `<p><strong>Số lần luyện tập đã hoàn thành:</strong> ${totalSessions}</p>`;
        }

        // Cập nhật tab Lịch sử
        historyTab.innerHTML = '<h3>Lịch sử luyện tập</h3><ul id="history-list"></ul>';
        const historyList = document.getElementById('history-list');
        if (history.length === 0) {
            const noDataMessage = document.createElement('li');
            noDataMessage.textContent = 'Chưa có lịch sử luyện tập.';
            historyList.appendChild(noDataMessage);
        } else {
            history.forEach(entry => {
                const listItem = document.createElement('li');
                let dateString = 'Invalid Date';

                if (entry.timestamp) {
                    dateString = new Date(entry.timestamp).toLocaleString();
                } else if (entry.date) {
                    dateString = new Date(entry.date).toLocaleString();
                }

                let durationText = '';
                if (entry.durationTypeLabel) {
                    durationText = `Thời gian: ${entry.durationTypeLabel}`;
                } else {
                    durationText = `Thời gian: ${Math.round(entry.duration) || 0} giây`; // Đảm bảo có giá trị 0 nếu NaN
                }

                listItem.textContent = `${dateString} - WPM: ${entry.wpm || 'null'}, Độ chính xác: ${entry.accuracy || 'null'}%, ${durationText}`;
                historyList.appendChild(listItem);
            });
        }
    }

    // Gọi updateStatisticsDisplay khi trang Thống kê được hiển thị
    const statisticsPageLink = Array.from(sidebarLinks).find(link => link.getAttribute('href') === '#statistics');
    if (statisticsPageLink) {
        statisticsPageLink.addEventListener('click', () => {
            showPage('statistics-page');
            updateStatisticsDisplay();
        });
    }

    // Gọi updateStatisticsDisplay khi trang tải lần đầu (nếu người dùng đang ở trang Thống kê)
    if (window.location.hash === '#statistics') {
        showPage('statistics-page');
        updateStatisticsDisplay();
    }

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