import React from "react";
import {Composition} from "remotion";
import {SleepParalysis} from "./SleepParalysis";

export const RemotionRoot: React.FC = () => (
  <Composition id="SleepParalysis" component={SleepParalysis}
    durationInFrames={1080} fps={30} width={1080} height={1920}/>
);
