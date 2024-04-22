import CreateGameForm from '@/components/Form/CreateGameForm';

const content = {
  title: 'Create Game',
  buttonText: 'Create',
};

const CreateGamePage = () => {
  return (
    <div>
      <CreateGameForm content={content} />
    </div>
  );
};

export default CreateGamePage;
