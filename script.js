document.addEventListener('DOMContentLoaded', function() {
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
            isTypoShown = isChecked;
            console.log('Trạng thái hiển thị lỗi đã được lưu và cập nhật:', isChecked);
        });
    }

    const durationSelect = document.getElementById('duration-select');
    const customDurationInputContainer = document.querySelector('.custom-duration-input');
    const customDurationInput = document.getElementById('custom-duration');

    if (customDurationInputContainer) {
        const durationType = getTypingSetting(DURATION_KEY + '_type', 'fixed').toLowerCase();
        customDurationInputContainer.style.display = durationType === 'custom' ? 'flex' : 'none';

        if (customDurationInput) {
            const savedCustomDuration = getTypingSetting(DURATION_KEY + '_custom', '60');
            customDurationInput.value = savedCustomDuration;

            customDurationInput.addEventListener('input', function() {
                saveTypingSetting(DURATION_KEY + '_custom', this.value);
            });
        }
    }
    if (durationSelect) {
        durationSelect.value = getTypingSetting(DURATION_KEY + '_type', '1');

        durationSelect.addEventListener('change', function() {
            saveTypingSetting(DURATION_KEY + '_type', this.value);
            if (this.value === 'Custom') {
                if (customDurationInputContainer) {
                    customDurationInputContainer.style.display = 'flex';
                    if (customDurationInput) {
                        const savedCustomDuration = getTypingSetting(DURATION_KEY + '_custom', '60');
                        customDurationInput.value = savedCustomDuration;
                    }
                }
            } else {
                if (customDurationInputContainer) {
                    customDurationInputContainer.style.display = 'none';
                }
                saveTypingSetting(DURATION_KEY + '_fixed', this.value);
            }
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
    let linesOfText = [];
    let currentLineIndex = 0;
    let currentWordIndexInLine = 0;
    let wordSpacing;
    let totalKeyStrokes = 0;
    let totalCorrectChars = 0;
    let totalIncorrectChars = 0;
    let startTime = null;
    let finalWPM = 0;
    let finalAccuracy = 0;

    function getMaxLineWidth() {
        const wordDisplay = document.querySelector('.word-display');
        if (wordDisplay) {
            const paddingLeft = parseFloat(getComputedStyle(wordDisplay).paddingLeft) || 0;
            const paddingRight = parseFloat(getComputedStyle(wordDisplay).paddingRight) || 0;
            return wordDisplay.offsetWidth - paddingLeft - paddingRight;
        }
        return 680;
    }

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
    wordSpacing = actualSpaceWidth;

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

    showPage('home-page');

    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const targetPageId = this.getAttribute('href').substring(1) + '-page';
            showPage(targetPageId);
        });
    });

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

        const durationType = getTypingSetting(DURATION_KEY + '_type', '1').trim().toLowerCase();
        const customSecondsString = getTypingSetting(DURATION_KEY + '_custom', '60');
        const customSeconds = parseInt(customSecondsString, 10) || 60;

        console.log('Giá trị typingDuration_custom khi init:', customSecondsString);
        console.log('Giá trị typingDuration_type khi init:', durationType);
        console.log('Giá trị customSeconds sau parseInt:', customSeconds);

        if (durationType === 'custom') {
            timeLeft = customSeconds;
            console.log('timeLeft (inside custom):', timeLeft);
            if (timeLeft <= 0) {
                timeLeft = 60;
                alert('Thời gian tùy chỉnh không hợp lệ, sử dụng 60 giây.');
                console.log('timeLeft (custom invalid, reset to 60):', timeLeft);
            }
        } else {
            timeLeft = parseInt(durationType, 10) * 60;
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
        startTime = null;
    }

    function calculateWPM() {
        if (!startTime || totalCorrectChars === 0) return 0;
        const endTime = new Date().getTime();
        const elapsedSeconds = (endTime - startTime) / 1000;
        const elapsedMinutes = elapsedSeconds / 60;
        const wordsTyped = totalCorrectChars / 5;
        return elapsedMinutes > 0 ? Math.max(0, Math.floor(wordsTyped / elapsedMinutes)) : 0;
    }

    function calculateAccuracy() {
        if (totalKeyStrokes === 0) return '0%';
        return Math.round((totalCorrectChars / totalKeyStrokes) * 100) + '%';
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
            wpmDisplay.innerText = calculateWPM();
            accuracyDisplay.innerText = calculateAccuracy();
        } else {
            clearInterval(timer);
            typingInput.disabled = true;
            endGame();
        }
    }

    function handleInput() {
        console.log('isTypoShown:', isTypoShown);

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
                        typedWordSpan.innerHTML = '';
                        for (let i = 0; i < expectedWord.length; i++) {
                            const span = document.createElement('span');
                            span.innerText = expectedWord[i];
                            if (typedWord[i] === expectedWord[i]) {
                                span.className = 'correct';
                            } else if (typedWord[i] !== undefined) {
                                span.className = 'incorrect';
                            } else {
                                span.className = 'incomplete';
                            }
                            typedWordSpan.appendChild(span);
                        }
                        if (typedWord.length > expectedWord.length) {
                            typedWordSpan.classList.add('incorrect-length');
                        } else if (typedWord.length < expectedWord.length && typedWord !== expectedWord.substring(0, typedWord.length)) {
                            typedWordSpan.classList.add('incorrect-length');
                        }
                    } else {
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

        const wordsTypedFinal = totalCorrectChars / 5;
        finalWPM = Math.round(wordsTypedFinal / (timeTakenSeconds / 60)) || 0;
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
            durationLabel = `${parseInt(durationType, 10)} phút`;
        }

        console.log('Giá trị timeTakenSeconds khi endGame:', timeTakenSeconds);
        console.log('Giá trị durationType khi endGame:', durationType);
        console.log('Giá trị customDuration khi endGame:', customDuration);
        console.log('Giá trị durationLabel khi endGame:', durationLabel);

        history.push({
            timestamp: new Date().toISOString(),
            wpm: finalWPM,
            accuracy: parseFloat(finalAccuracy.slice(0, -1)),
            duration: timeTakenSeconds,
            durationTypeLabel: durationLabel,
            totalKeystrokes: totalKeyStrokes,
            correctKeystrokes: totalCorrectChars,
            incorrectKeystrokes: totalIncorrectChars
        });
        saveTypingHistory(history);
    }

    restartButton.addEventListener('click', initTypingGame);
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
            updateStatisticsDisplay();
        });
    });

    function updateStatisticsDisplay() {
        const history = getTypingHistory();

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
                    durationText = `Thời gian: ${Math.round(entry.duration) || 0} giây`;
                }

                listItem.textContent = `${dateString} - WPM: ${entry.wpm || 'null'}, Độ chính xác: ${entry.accuracy || 'null'}%, ${durationText}`;
                historyList.appendChild(listItem);
            });
        }
    }

    const statisticsPageLink = Array.from(sidebarLinks).find(link => link.getAttribute('href') === '#statistics');
    if (statisticsPageLink) {
        statisticsPageLink.addEventListener('click', () => {
            showPage('statistics-page');
            updateStatisticsDisplay();
        });
    }

    if (window.location.hash === '#statistics') {
        showPage('statistics-page');
        updateStatisticsDisplay();
    }

    if (prevButton) prevButton.addEventListener('click', prevSlide);
    if (nextButton) nextButton.addEventListener('click', nextSlide);
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => goToIndicator(index));
    });

    const slideButtons = document.querySelectorAll('.slide-button');
    slideButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            const targetPageId = this.getAttribute('data-target');
            showPage(targetPageId + '-page');
        });
    });

    showPage('home-page');

    goToSlide(0);

    const typingPageLink = Array.from(sidebarLinks).find(link => link.getAttribute('href') === '#typing');
    if (typingPageLink) {
        typingPageLink.addEventListener('click', () => {
            showPage('typing-page');
        });
    }
});
