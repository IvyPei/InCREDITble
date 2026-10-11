import { StageOutro } from './scenes/StageOutro';
import { Composition, Folder } from "remotion";
import { Film } from "./Film";
import { Brand } from "./scenes/Brand";
import { Pain } from "./scenes/Pain";
import { Experience } from "./scenes/Experience";
import { Preferences } from "./scenes/Preferences";
import { Matches } from "./scenes/Matches";
import { Assistant } from "./scenes/Assistant";
import { Quotes } from "./scenes/Quotes";
import { Order } from "./scenes/Order";
import { Success } from "./scenes/Success";
import { Overview } from "./scenes/Overview";
import { Contact } from "./scenes/Contact";
import { Closing } from "./scenes/Closing";
export const RemotionRoot = () => (
  <>
    <Composition
      id="InCreditble-v2"
      component={Film}
      durationInFrames={4338}
      fps={30}
      width={1920}
      height={1080}
    />
    <Folder name="Scenes">
      <Composition id="StageOutro" component={StageOutro} durationInFrames={168} fps={30} width={1920} height={1080} />
      <Composition
        id="Pain"
        component={Pain}
        durationInFrames={385}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Brand"
        component={Brand}
        durationInFrames={236}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Experience"
        component={Experience}
        durationInFrames={376}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Preferences"
        component={Preferences}
        durationInFrames={432}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Matches"
        component={Matches}
        durationInFrames={377}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Assistant"
        component={Assistant}
        durationInFrames={398}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Quotes"
        component={Quotes}
        durationInFrames={364}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Order"
        component={Order}
        durationInFrames={437}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Success"
        component={Success}
        durationInFrames={237}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Overview"
        component={Overview}
        durationInFrames={371}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Closing"
        component={Closing}
        durationInFrames={425}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Contact"
        component={Contact}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
    </Folder>
  </>
);
