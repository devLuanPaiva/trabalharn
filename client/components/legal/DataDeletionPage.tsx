import { getContactChannels } from '@/lib/site/contact';
import { legalContentClassNames as c } from './legal-content-class-names';
import { LegalPageLayout } from './LegalPageLayout';
import { LegalSection } from './LegalSection';

export function DataDeletionPage() {
  const { instagram } = getContactChannels();

  return (
    <LegalPageLayout title="Exclusão de Dados" lastUpdated="19 de agosto de 2026">
      <LegalSection title="Por que essa página existe">
        <p className={c.paragraph}>
          O TrabalhaRN não tem cadastro, login nem formulários — por isso, na prática, não guardamos dados pessoais
          de quem visita a página ou se candidata a uma vaga divulgada por nós. Ainda assim, você tem o direito de
          pedir a exclusão de qualquer informação sua que, por algum motivo, tenha chegado até a gente (por exemplo,
          em uma mensagem direta).
        </p>
      </LegalSection>

      <LegalSection title="O que pode ser excluído">
        <p className={c.paragraph}>
          Mensagens, comentários ou qualquer dado pessoal que você tenha compartilhado com o TrabalhaRN diretamente
          (como no Instagram). Não temos acesso e não podemos excluir dados que você enviou para a empresa
          contratante ao se candidatar a uma vaga — nesse caso, o pedido precisa ser feito diretamente à empresa
          responsável pelo processo seletivo.
        </p>
      </LegalSection>

      <LegalSection title="Como pedir a exclusão">
        <p className={c.paragraph}>
          Envie uma mensagem para{' '}
          <a href={instagram.href} target="_blank" rel="noreferrer noopener" className={c.link}>
            {instagram.label}
          </a>{' '}
          no Instagram contando o que você quer que seja excluído. Sempre que possível, respondemos e confirmamos a
          exclusão em poucos dias.
        </p>
      </LegalSection>

      <LegalSection title="Vaga publicada com informação sua">
        <p className={c.paragraph}>
          Se uma vaga divulgada pelo TrabalhaRN contém alguma informação pessoal sua que não deveria estar pública
          (por exemplo, um contato particular em vez do canal oficial da empresa), avise a gente pelo mesmo canal —
          vamos remover ou corrigir a divulgação.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
