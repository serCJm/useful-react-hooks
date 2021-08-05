// testCase is CSS media prop
// i.e. `(max-width: 991px)`

import { useEffect, useState } from 'react';

const useScreenMatches = (testCase) => {
    const [screenMatches, setScreenMatches] = useState(
        typeof window !== `undefined`
            ? window?.matchMedia(testCase).matches
            : false,
    );

    useEffect(() => {
        const resize = () => {
            let resizeTmt;
            clearTimeout(resizeTmt);
            resizeTmt = setTimeout(() => {
                setScreenMatches(
                    typeof window !== `undefined`
                        ? window?.matchMedia(testCase).matches
                        : false,
                );
            }, 100);
        };

        if (typeof window !== `undefined`)
            window?.addEventListener(`resize`, resize);

        return () => {
            if (typeof window !== `undefined`)
                window?.removeEventListener(`resize`, resize);
            return; // eslint-disable-line
        };
    }, []);

    return screenMatches;
};

export default useScreenMatches;
