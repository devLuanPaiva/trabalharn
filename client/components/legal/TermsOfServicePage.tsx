import Link from 'next/link';
import { getContactChannels } from '@/lib/site/contact';
import { legalContentClassNames as c } from './legal-content-class-names';
import { LegalPageLayout } from './LegalPageLayout';
import { LegalSection } from './LegalSection';

export function TermsOfServicePage() {
  const { instagram } = getContactChannels();

  return (
    <LegalPageLayout title="Termos e Serviços" lastUpdated="19 de agosto de 2026">
      <LegalSection title="Sobre o TrabalhaRN">
        <p className={c.paragraph}>
          O TrabalhaRN é uma página que divulga vagas de emprego no Rio Grande do Norte. Não somos uma empresa de
          recrutamento nem a contratante das vagas publicadas: reunimos oportunidades já publicadas em outros
          portais e sites de vagas, e as republicamos com a nossa identidade visual, sempre citando a fonte
          original, sem adicionar ou alterar informações.
        </p>
      </LegalSection>

      <LegalSection title="As vagas são responsabilidade da fonte original">
        <p className={c.paragraph}>
          O conteúdo de cada vaga (cargo, empresa, salário, requisitos, forma de candidatura) é de responsabilidade
          de quem publicou originalmente. O TrabalhaRN não garante que uma vaga ainda esteja disponível no momento
          em que você a vê — ela pode ter sido preenchida ou alterada na fonte depois da nossa publicação. Confirme
          sempre as informações direto no canal oficial antes de se candidatar.
        </p>
      </LegalSection>

      <LegalSection title="Como usar o conteúdo do TrabalhaRN">
        <p className={c.paragraph}>
          O conteúdo divulgado aqui é para uso pessoal, na sua busca por emprego. Não é permitido copiar, reproduzir
          ou redistribuir nossas artes e legendas com fins comerciais sem autorização.
        </p>
      </LegalSection>

      <LegalSection title="Cuidado com golpes">
        <p className={c.paragraph}>
          O TrabalhaRN nunca cobra para divulgar seu currículo ou garantir uma vaga. Desconfie de qualquer processo
          seletivo que peça pagamento, depósito, compra de material ou dados bancários — isso não é prática de vaga
          séria. Se encontrar algo assim em uma vaga divulgada por nós, avise a gente.
        </p>
      </LegalSection>

      <LegalSection title="Empresas que querem divulgar vagas">
        <p className={c.paragraph}>
          Se você representa uma empresa e quer que uma vaga seja divulgada no TrabalhaRN, entre em contato pelo
          Instagram{' '}
          <a href={instagram.href} target="_blank" rel="noreferrer noopener" className={c.link}>
            {instagram.label}
          </a>
          . Também é por lá que você pode pedir a remoção ou correção de uma vaga já publicada.
        </p>
      </LegalSection>

      <LegalSection title="Dados pessoais">
        <p className={c.paragraph}>
          O TrabalhaRN não coleta dados pessoais de quem visita a página. Veja os detalhes na nossa{' '}
          <Link href="/politicas-de-privacidade" className={c.link}>
            Política de Privacidade
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection title="Alterações nestes termos">
        <p className={c.paragraph}>
          Podemos atualizar estes termos quando necessário para refletir mudanças na forma como o TrabalhaRN
          funciona. A data no topo desta página sempre mostra a versão mais recente.
        </p>
      </LegalSection>

      <LegalSection title="Fale com a gente">
        <p className={c.paragraph}>
          Dúvidas sobre estes termos? Manda mensagem pra gente no Instagram{' '}
          <a href={instagram.href} target="_blank" rel="noreferrer noopener" className={c.link}>
            {instagram.label}
          </a>
          .
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
