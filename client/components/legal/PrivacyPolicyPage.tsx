import Link from 'next/link';
import { getContactChannels } from '@/lib/site/contact';
import { legalContentClassNames as c } from './legal-content-class-names';
import { LegalPageLayout } from './LegalPageLayout';
import { LegalSection } from './LegalSection';

export function PrivacyPolicyPage() {
  const { instagram } = getContactChannels();

  return (
    <LegalPageLayout title="Política de Privacidade" lastUpdated="19 de agosto de 2026">
      <LegalSection title="O que é o TrabalhaRN">
        <p className={c.paragraph}>
          O TrabalhaRN é uma página que reúne vagas de emprego publicadas em outros portais e sites de vagas (como
          Solides, Gupy e outros) e as divulga com a nossa identidade visual, sempre citando a fonte original. Não
          criamos, alteramos nem completamos informações das vagas — o conteúdo mostrado é o que a empresa ou o
          portal de origem publicou.
        </p>
      </LegalSection>

      <LegalSection title="Não coletamos dados de quem visita a página">
        <p className={c.paragraph}>
          O TrabalhaRN não tem cadastro, login, formulário de currículo nem qualquer área para você preencher dados
          pessoais. Não pedimos nome, CPF, telefone, e-mail ou currículo em nenhum momento.
        </p>
        <p className={c.paragraph}>
          Quando você quer se candidatar a uma vaga, te direcionamos para o canal oficial da empresa ou do portal de
          origem — o processo de candidatura acontece lá, não aqui. Não guardamos nenhuma informação sobre essa
          candidatura.
        </p>
      </LegalSection>

      <LegalSection title="Dados técnicos de navegação">
        <p className={c.paragraph}>
          Como em qualquer site, o provedor que hospeda o TrabalhaRN pode registrar informações técnicas básicas de
          acesso (como endereço IP e tipo de navegador), usadas apenas para manter o site funcionando e seguro —
          nunca para identificar ou te acompanhar pela internet. Não usamos cookies de rastreamento nem ferramentas
          de anúncio.
        </p>
      </LegalSection>

      <LegalSection title="Suas informações continuam sendo suas">
        <p className={c.paragraph}>
          Como não coletamos dados pessoais, normalmente não há nada para excluir. Mesmo assim, se você acredita que
          alguma informação sua apareceu na página por engano ou tem dúvidas sobre privacidade, você pode falar com a
          gente — veja como na página de{' '}
          <Link href="/exclusao-de-dados" className={c.link}>
            Exclusão de Dados
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection title="Vagas de terceiros">
        <p className={c.paragraph}>
          As vagas divulgadas pertencem às empresas e portais de origem, sempre identificados no post. Se uma vaga
          saiu do ar na fonte original, foi preenchida ou contém uma informação incorreta, avise a gente pelo
          Instagram que damos baixa ou corrigimos a divulgação.
        </p>
      </LegalSection>

      <LegalSection title="Fale com a gente">
        <p className={c.paragraph}>
          Dúvidas sobre esta política? Manda mensagem pra gente no Instagram{' '}
          <a href={instagram.href} target="_blank" rel="noreferrer noopener" className={c.link}>
            {instagram.label}
          </a>
          .
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
