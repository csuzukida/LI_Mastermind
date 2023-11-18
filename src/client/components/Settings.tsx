interface SettingsProps {
  setDifficultyLevel: (difficultyLevel: number) => void;
}

const Settings = ({ setDifficultyLevel }: SettingsProps) => {
  console.log(setDifficultyLevel);
  return (
    <>
      <>Settings</>
    </>
  );
};

export default Settings;
