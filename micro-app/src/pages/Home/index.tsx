import { PageContainer } from '@ant-design/pro-components';
import { MicroApp } from '@umijs/max';

const HomePage: React.FC = () => {
  return (
    <PageContainer ghost>
      <MicroApp name="app1" base="/app1/project" />
    </PageContainer>
  );
};

export default HomePage;
