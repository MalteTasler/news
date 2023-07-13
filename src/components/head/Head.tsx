import { AnimationWrapper } from "chayns-components";
import React from "react";

const Head = () => (
    <div className="Head">
        <AnimationWrapper>
            <h1 id="pageHeadline">Aktuelle News</h1>
            <p id="pageSubHeadline">
                Kurz, kompakt und immer wieder frisch informieren wir hier
                über aktuelle Themen und Aktionen.
            </p>
        </AnimationWrapper>
    </div>
)

Head.displayName = 'Head';

export default Head;
