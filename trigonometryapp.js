document.addEventListener('DOMContentLoaded', function () {
    // ======================
    // TRIGONOMETRY CALCULATOR
    // ======================
    function initTrigCalculator() {
        const calculatorForm = document.createElement('div');
        calculatorForm.className = 'trig-calculator';
        calculatorForm.innerHTML = `
            <h3><i class="fas fa-calculator"></i>Calculator</h3>
            <div class="calculator-grid">
                <div class="calculator-input">
                    <label for="trig-angle">Angle (degrees):</label>
                    <input type="number" id="trig-angle" placeholder="Enter angle">
                </div>
                <div class="calculator-buttons">
                    <button id="calc-sin">sin</button>
                    <button id="calc-cos">cos</button>
                    <button id="calc-tan">tan</button>
                </div>
                <div class="calculator-result">
                    <p>Result: <span id="trig-result">0</span></p>
                </div>
            </div>
        `;

        const introSection = document.getElementById('trigonometry-introduction');
        if (introSection) {
            introSection.insertAdjacentElement('afterend', calculatorForm);
        }

        document.getElementById('calc-sin').addEventListener('click', function () {
            const angle = parseFloat(document.getElementById('trig-angle').value);
            if (!isNaN(angle)) {
                const result = Math.sin(angle * Math.PI / 180);
                document.getElementById('trig-result').textContent = result.toFixed(4);
            }
        });

        document.getElementById('calc-cos').addEventListener('click', function () {
            const angle = parseFloat(document.getElementById('trig-angle').value);
            if (!isNaN(angle)) {
                const result = Math.cos(angle * Math.PI / 180);
                document.getElementById('trig-result').textContent = result.toFixed(4);
            }
        });

        document.getElementById('calc-tan').addEventListener('click', function () {
            const angle = parseFloat(document.getElementById('trig-angle').value);
            if (!isNaN(angle)) {
                if (angle % 90 === 0 && angle % 180 !== 0) {
                    document.getElementById('trig-result').textContent = "undefined";
                } else {
                    const result = Math.tan(angle * Math.PI / 180);
                    document.getElementById('trig-result').textContent = result.toFixed(4);
                }
            }
        });
    }

    // ======================
    // INTERACTIVE UNIT CIRCLE
    // ======================
    function initUnitCircle() {
        const unitCircleSection = document.getElementById('unit-circle');
        if (!unitCircleSection) return;

        const interactiveCircle = document.createElement('div');
        interactiveCircle.className = 'interactive-unit-circle';
        interactiveCircle.innerHTML = `
            <div class="circle-container">
                <div class="circle"></div>
                <div class="angle-line"></div>
                <div class="angle-handle"></div>
                <div class="coordinates">
                    <p>Angle: <span id="circle-angle">0°</span></p>
                    <p>Coordinates: (<span id="circle-x">1.00</span>, <span id="circle-y">0.00</span>)</p>
                    <p>sin(θ) = <span id="circle-sin">0.00</span></p>
                    <p>cos(θ) = <span id="circle-cos">1.00</span></p>
                    <p>tan(θ) = <span id="circle-tan">0.00</span></p>
                </div>
            </div>
            <div class="angle-control">
                <input type="range" id="angle-slider" min="0" max="360" value="0">
                <button id="animate-circle">Animate</button>
                <button id="stop-animation">Stop</button>
            </div>
        `;

        unitCircleSection.appendChild(interactiveCircle);

        const angleLine = interactiveCircle.querySelector('.angle-line');
        const angleHandle = interactiveCircle.querySelector('.angle-handle');
        const angleDisplay = interactiveCircle.querySelector('#circle-angle');
        const xDisplay = interactiveCircle.querySelector('#circle-x');
        const yDisplay = interactiveCircle.querySelector('#circle-y');
        const sinDisplay = interactiveCircle.querySelector('#circle-sin');
        const cosDisplay = interactiveCircle.querySelector('#circle-cos');
        const tanDisplay = interactiveCircle.querySelector('#circle-tan');
        const angleSlider = interactiveCircle.querySelector('#angle-slider');
        const animateBtn = interactiveCircle.querySelector('#animate-circle');
        const stopBtn = interactiveCircle.querySelector('#stop-animation');

        let animationId = null;
        let angle = 0;

        function updateCircle(angleDegrees) {
            const angleRad = angleDegrees * Math.PI / 180;
            const x = Math.cos(angleRad);
            const y = Math.sin(angleRad);

            angleDisplay.textContent = `${angleDegrees}°`;
            xDisplay.textContent = x.toFixed(2);
            yDisplay.textContent = y.toFixed(2);
            sinDisplay.textContent = y.toFixed(2);
            cosDisplay.textContent = x.toFixed(2);

            if (angleDegrees % 90 === 0 && angleDegrees % 180 !== 0) {
                tanDisplay.textContent = "undefined";
            } else {
                tanDisplay.textContent = Math.tan(angleRad).toFixed(2);
            }

            angleLine.style.transform = `rotate(${angleDegrees}deg)`;
            angleHandle.style.left = `${50 + x * 45}%`;
            angleHandle.style.top = `${50 - y * 45}%`;
        }

        angleSlider.addEventListener('input', function () {
            angle = parseInt(this.value);
            updateCircle(angle);
        });

        function animateCircle() {
            angle = (angle + 1) % 360;
            angleSlider.value = angle;
            updateCircle(angle);
            animationId = requestAnimationFrame(animateCircle);
        }

        animateBtn.addEventListener('click', function () {
            if (!animationId) {
                animateCircle();
            }
        });

        stopBtn.addEventListener('click', function () {
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
        });

        updateCircle(0);
    }

    // ======================
    // EXERCISE SOLUTIONS TOGGLE
    // ======================
    function initExerciseSolutions() {
        const exercisesSection = document.getElementById('exercises');
        if (!exercisesSection) return;

        const solutions = [
            "1", "2", "0.8", "0.2929", "1.3660", "undefined", "0.8660", "0.8660", "0.5", "2",
            "5.74", "16.26°, 73.74°, 90°", "4.83m", "3.464", "12", "17", "22.62°", "40",
            "Proof: (1 - cos²θ)(1 + cot²θ) = sin²θ * csc²θ = sin²θ * (1/sin²θ) = 1",
            "Proof: 2tanθ/(1 + tan²θ) = 2(sinθ/cosθ)/(1 + sin²θ/cos²θ) = 2sinθcosθ/(cos²θ + sin²θ) = 2sinθcosθ = sin(2θ)",
            "Simplified: 2(sin²θ + cos²θ) = 2",
            "Proof: sec²θ - tan²θ = 1/cos²θ - sin²θ/cos²θ = (1 - sin²θ)/cos²θ = cos²θ/cos²θ = 1",
            "Proof: 1 - sin²θ = cos²θ (Pythagorean identity)",
            "-0.7071", "sinθ=4/5, cosθ=-3/5, tanθ=-4/3", "5π/4, reference angle=45°", "0",
            "sinθ=12/13, cosθ=5/13, tanθ=12/5", "5π/6, reference angle=30°", "1.732",
            "18.03km", "59.04°", "83.14 square units", "24m", "18.43°"
        ];

        const solutionBtn = document.createElement('button');
        solutionBtn.className = 'show-solutions-btn';
        solutionBtn.textContent = 'Show Solutions';
        exercisesSection.appendChild(solutionBtn);

        solutionBtn.addEventListener('click', function () {
            const exerciseItems = exercisesSection.querySelectorAll('li');
            exerciseItems.forEach((item, index) => {
                if (index < solutions.length) {
                    const solutionDiv = document.createElement('div');
                    solutionDiv.className = 'exercise-solution';
                    solutionDiv.innerHTML = `<strong>Solution:</strong> ${solutions[index]}`;

                    if (!item.querySelector('.exercise-solution')) {
                        item.appendChild(solutionDiv);
                    }
                }
            });

            this.textContent = this.textContent === 'Show Solutions' ? 'Hide Solutions' : 'Show Solutions';
            const solutionsVisible = this.textContent === 'Hide Solutions';

            const allSolutions = exercisesSection.querySelectorAll('.exercise-solution');
            allSolutions.forEach(solution => {
                solution.style.display = solutionsVisible ? 'block' : 'none';
            });
        });
    }

    // ======================
    // FORMULA HIGHLIGHTING
    // ======================
    function initFormulaHighlighting() {
        document.querySelectorAll('.formula').forEach(formula => {
            formula.addEventListener('click', function () {
                this.classList.toggle('highlighted');
                setTimeout(() => {
                    this.classList.remove('highlighted');
                }, 3000);
            });
        });
    }

    // ======================
    // DYNAMIC CONTENT LOADING
    // ======================
    function initDynamicContent() {
        const forumPosts = document.querySelectorAll('.trig-forum-post');
        if (forumPosts.length > 0) {
            forumPosts[0].classList.add('recent-post');
        }

        document.querySelectorAll('.trigonometry-special-triangles .triangle').forEach(triangle => {
            triangle.addEventListener('click', function () {
                this.classList.toggle('exploded-view');
            });
        });
    }

    // Dummy function placeholder
    function initSideNav() {
        // Initialize side navigation here if needed
    }

    // ======================
    // INITIALIZE EVERYTHING
    // ======================
    function initTrigonometryApp() {
        initSideNav();
        initTrigCalculator();
        initUnitCircle();
        initExerciseSolutions();
        initFormulaHighlighting();
        initDynamicContent();
    }

    initTrigonometryApp();
});
