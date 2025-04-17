import ComplaintPage from './ComplaintPage';

export default async function Page({ params }) {
  const { id } = await params;

  return <ComplaintPage id={id} />;
}
