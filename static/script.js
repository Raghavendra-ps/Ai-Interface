document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('aiCoreCanvas');
    if (!canvas) {
        console.error("AI Core Canvas not found!");
        return;
    }
    const ctx = canvas.getContext('2d');

    const mainContent = document.querySelector('.main-content');
    let canvasSize;
    let baseRadius; // Will be the radius of the main outer ring of dots/markings

    const colors = {
        accent: getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim() || '#00FFFF',
        accentDim: getComputedStyle(document.documentElement).getPropertyValue('--accent-color-dim').trim() || 'rgba(0, 255, 255, 0.5)',
        accentFaint: getComputedStyle(document.documentElement).getPropertyValue('--accent-color-faint').trim() || 'rgba(0, 255, 255, 0.2)',
        text: getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim() || '#b0c4de',
        redDots: '#FF4136', // Example red
        blueDots: '#0074D9' // Example blue
    };

    function resizeCanvas() {
        const style = getComputedStyle(mainContent);
        const paddingLeft = parseFloat(style.paddingLeft) || 0;
        const paddingRight = parseFloat(style.paddingRight) || 0;
        const paddingTop = parseFloat(style.paddingTop) || 0;
        const paddingBottom = parseFloat(style.paddingBottom) || 0;

        const availableWidth = mainContent.clientWidth - paddingLeft - paddingRight;
        const availableHeight = mainContent.clientHeight - paddingTop - paddingBottom;
        
        canvasSize = Math.min(availableWidth, availableHeight) * 0.95; // Use 95% to leave some margin

        if (canvasSize < 100) canvasSize = 100; // Minimum size

        canvas.width = canvasSize;
        canvas.height = canvasSize;

        baseRadius = canvasSize * 0.4; // Main radius for the outer elements

        drawStaticCoreElements();
        // Later, we will call an animation function here
    }

    function drawStaticCoreElements() {
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        // --- 1. Outer Ring with Degree Markings (as per reference) ---
        const outerRingRadius = baseRadius;
        const tickColor = colors.accentDim;
        const textColor = colors.text;
        const degreeFontSize = Math.max(8, canvasSize * 0.025); // Min font size 8px

        ctx.strokeStyle = tickColor;
        ctx.lineWidth = 1;

        // Draw the main circle for markings (subtle)
        // ctx.beginPath();
        // ctx.arc(centerX, centerY, outerRingRadius, 0, 2 * Math.PI);
        // ctx.stroke(); // This line is often not visible in the reference, marks are key

        // Degree markings
        const numMajorMarks = 24; // Every 15 degrees (360 / 15 = 24)
        const numMinorMarksPerMajor = 2; // 2 minor marks between major ones (for 5-degree steps)
        
        ctx.font = `${degreeFontSize}px Orbitron, Consolas, monospace`;
        ctx.fillStyle = textColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        for (let i = 0; i < numMajorMarks; i++) {
            const majorAngleDeg = i * (360 / numMajorMarks);
            const majorAngleRad = majorAngleDeg * Math.PI / 180;

            // Major tick
            const majorTickLength = canvasSize * 0.025;
            const startX = centerX + Math.cos(majorAngleRad) * outerRingRadius;
            const startY = centerY + Math.sin(majorAngleRad) * outerRingRadius;
            const endX = centerX + Math.cos(majorAngleRad) * (outerRingRadius - majorTickLength);
            const endY = centerY + Math.sin(majorAngleRad) * (outerRingRadius - majorTickLength);
            
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();

            // Degree text (rotated to be upright and outside the ring)
            const textRadius = outerRingRadius + degreeFontSize * 1.2; // Position text outside
            const textX = centerX + Math.cos(majorAngleRad) * textRadius;
            const textY = centerY + Math.sin(majorAngleRad) * textRadius;
            
            ctx.save();
            ctx.translate(textX, textY);
            // Rotate text to be upright relative to the center
            // Add 90 degrees (PI/2) because text is drawn horizontally by default
            let rotationAngle = majorAngleRad + Math.PI / 2;
            // Prevent upside-down text on the bottom half
            if (majorAngleDeg > 90 && majorAngleDeg < 270) {
                rotationAngle += Math.PI;
            }
            ctx.rotate(rotationAngle);
            ctx.fillText(majorAngleDeg.toString(), 0, 0);
            ctx.restore();


            // Minor ticks
            if (i < numMajorMarks) { // Don't draw minor ticks after the last major mark that would overlap 0
                for (let j = 1; j <= numMinorMarksPerMajor; j++) {
                    const minorAngleDeg = majorAngleDeg + j * (360 / numMajorMarks / (numMinorMarksPerMajor + 1));
                    const minorAngleRad = minorAngleDeg * Math.PI / 180;
                    const minorTickLength = majorTickLength * 0.6;

                    const mStartX = centerX + Math.cos(minorAngleRad) * outerRingRadius;
                    const mStartY = centerY + Math.sin(minorAngleRad) * outerRingRadius;
                    const mEndX = centerX + Math.cos(minorAngleRad) * (outerRingRadius - minorTickLength);
                    const mEndY = centerY + Math.sin(minorAngleRad) * (outerRingRadius - minorTickLength);

                    ctx.beginPath();
                    ctx.moveTo(mStartX, mStartY);
                    ctx.lineTo(mEndX, mEndY);
                    ctx.stroke();
                }
            }
        }

        // --- 2. Inner Dashed Cyan Ring ---
        const dashedRingRadius = baseRadius * 0.85;
        const dashLength = canvasSize * 0.015;
        const gapLength = canvasSize * 0.01;
        ctx.strokeStyle = colors.accent;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([dashLength, gapLength]);
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, dashedRingRadius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.setLineDash([]); // Reset line dash

        // --- 3. "DATA PROCESSING" Label ---
        const labelText = "DATA PROCESSING";
        const labelFontSize = Math.max(8, canvasSize * 0.03);
        const labelBoxHeight = labelFontSize * 1.8;
        const labelBoxWidth = labelText.length * labelFontSize * 0.65; // Approximate width
        const labelBoxRadius = labelBoxHeight / 2; // For rounded ends

        const labelAngle = -90 * Math.PI / 180; // Top of the circle
        const labelCenterY = centerY + Math.sin(labelAngle) * (dashedRingRadius - labelBoxHeight * 0.1); // Slightly inside dashed ring
        const labelCenterX = centerX + Math.cos(labelAngle) * (dashedRingRadius - labelBoxHeight * 0.1);

        // Draw rounded rectangle for label background
        ctx.fillStyle = colors.accent; // Solid accent color for the box
        ctx.beginPath();
        ctx.moveTo(labelCenterX - labelBoxWidth / 2 + labelBoxRadius, labelCenterY - labelBoxHeight / 2);
        ctx.lineTo(labelCenterX + labelBoxWidth / 2 - labelBoxRadius, labelCenterY - labelBoxHeight / 2);
        ctx.arcTo(labelCenterX + labelBoxWidth / 2, labelCenterY - labelBoxHeight / 2, labelCenterX + labelBoxWidth / 2, labelCenterY - labelBoxHeight / 2 + labelBoxRadius, labelBoxRadius);
        ctx.lineTo(labelCenterX + labelBoxWidth / 2, labelCenterY + labelBoxHeight / 2 - labelBoxRadius);
        ctx.arcTo(labelCenterX + labelBoxWidth / 2, labelCenterY + labelBoxHeight / 2, labelCenterX + labelBoxWidth / 2 - labelBoxRadius, labelCenterY + labelBoxHeight / 2, labelBoxRadius);
        ctx.lineTo(labelCenterX - labelBoxWidth / 2 + labelBoxRadius, labelCenterY + labelBoxHeight / 2);
        ctx.arcTo(labelCenterX - labelBoxWidth / 2, labelCenterY + labelBoxHeight / 2, labelCenterX - labelBoxWidth / 2, labelCenterY + labelBoxHeight / 2 - labelBoxRadius, labelBoxRadius);
        ctx.lineTo(labelCenterX - labelBoxWidth / 2, labelCenterY - labelBoxHeight / 2 + labelBoxRadius);
        ctx.arcTo(labelCenterX - labelBoxWidth / 2, labelCenterY - labelBoxHeight / 2, labelCenterX - labelBoxWidth / 2 + labelBoxRadius, labelCenterY - labelBoxHeight / 2, labelBoxRadius);
        ctx.closePath();
        ctx.fill();

        // Draw label text (dark text on light box)
        ctx.font = `bold ${labelFontSize}px Orbitron, Consolas, monospace`;
        ctx.fillStyle = '#05080d'; // Use primary background for text color for contrast
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(labelText, labelCenterX, labelCenterY + labelFontSize * 0.05); // Slight Y offset for better centering

        // --- 4. Crosshairs (Subtle) ---
        ctx.strokeStyle = colors.accentFaint;
        ctx.lineWidth = 0.5;
        const crosshairLength = baseRadius * 1.15; // Extend beyond the marks

        // Horizontal line
        ctx.beginPath();
        ctx.moveTo(centerX - crosshairLength, centerY);
        ctx.lineTo(centerX + crosshairLength, centerY);
        ctx.stroke();

        // Vertical line
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - crosshairLength);
        ctx.lineTo(centerX, centerY + crosshairLength);
        ctx.stroke();

        // --- Next: Dots and Animation ---
    }

    // --- Clock Update Function (from previous steps) ---
    function updateClock() {
        const now = new Date();
        const timeString = now.toTimeString().split(' ')[0];
        const timeDisplay = document.getElementById('current-time-display');
        if (timeDisplay) {
            timeDisplay.textContent = timeString;
        }
    }

    // --- Initial Setup ---
    if (mainContent) {
        resizeCanvas(); // Set initial size and draw
        window.addEventListener('resize', resizeCanvas); // Resize canvas when window resizes
    } else {
        console.error("Main content area not found for canvas sizing.");
    }
    
    setInterval(updateClock, 1000);
    updateClock(); // Initial call
});
