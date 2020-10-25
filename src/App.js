import {Header} from "./components/Header";
import {ModeSelector as Selector} from "./components/ModeSelector";
import {StartButton} from "./components/StartButton";
import styles from './styles/App.module.css';

function App() {
  return (
    <div>
      <Header/>
      <hr className={styles.seperator}/>
      <Selector/>
      <hr className={styles.seperator}/>
      <StartButton/>
    </div>
  );
}

export default App;
