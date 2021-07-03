import { useMemo } from 'react';

// HOOK WILL INJECT SCALE ANIMATION INTO A STYLE TAG
// ANIMATION IS USED FOR PERFORMANT VERTICAL EXPANSION AND COLLAPSE
// SOURCE: https://developers.google.com/web/updates/2017/03/performant-expand-and-collapse
// TODO: CALCULATE REQUIRED START/END
// TODO: ADD CUSTOMIZATIONS

function ease(v, pow = 4) {
    return 1 - (1 - v) ** pow;
}

function createKeyframeAnimation() {
    // Figure out the size of the element when collapsed.
    const startYEx = 0;
    const endYEx = 1;
    const startYCol = 1;
    const endYCol = 0;

    let animationExpand = ``;
    let inverseAnimationExpand = ``;
    let animationCollapse = ``;
    let inverseAnimationCollapse = ``;

    for (let step = 0; step <= 100; step += 1) {
        // Remap the step value to an eased one.
        const easedStep = ease(step / 100);

        // Calculate the scale of the element.
        const yScaleEx = +(startYEx + (endYEx - startYEx) * easedStep).toFixed(
            5,
        );
        const yScaleCol = +(
            startYCol +
            (endYCol - startYCol) * easedStep
        ).toFixed(5);

        animationExpand += `${step}% {
		transform: scaleY(${yScaleEx});
	  }`;
        animationCollapse += `${step}% {
		transform: scaleY(${yScaleCol});
	  }`;

        // And now the inverse for the contents.
        const invYScaleEx = +(1 / yScaleEx).toFixed(5);
        const invYScaleCol = +(1 / yScaleCol).toFixed(5);

        inverseAnimationExpand += `${step}% {
		transform: scaleY(${invYScaleEx});
	  }`;
        inverseAnimationCollapse += `${step}% {
		transform: scaleY(${invYScaleCol});
	  }`;
    }

    return `
	@keyframes menuExpandAnimation {
	  ${animationExpand}
	}

	@keyframes menuExpandContentsAnimation {
	  ${inverseAnimationExpand}
	}

	@keyframes menuCollapseAnimation {
		${animationCollapse}
	  }

	  @keyframes menuCollapseContentsAnimation {
		${inverseAnimationCollapse}
	  }`;
}

function injectStyles() {
    const style = createKeyframeAnimation();
    let menuEase = document.querySelector(`.menu-ease`);
    if (menuEase) {
        return;
    }

    menuEase = document.createElement(`style`);
    menuEase.classList.add(`menu-ease`);

    menuEase.textContent = style;
    document.head.appendChild(menuEase);
}

const useExpandCollapseAnimation = () => {
    useMemo(() => injectStyles(), []);
};

export default useExpandCollapseAnimation;
