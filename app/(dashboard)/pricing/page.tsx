import { checkoutAction } from '@/lib/payments/actions';
import { Check } from 'lucide-react';
import { getStripePrices, getStripeProducts } from '@/lib/payments/stripe';
import { SubmitButton } from './submit-button';

// Prices are fresh for one hour max
export const revalidate = 3600;

export default async function PricingPage() {
  const [prices, products] = await Promise.all([
    getStripePrices(),
    getStripeProducts(),
  ]);

  const basePlan = products.find((product) => product.name === 'Base');
  const proPlan = products.find((product) => product.name === 'Pro');
  const enterprisePlan = products.find((product) => product.name === 'Enterprise');

  const basePrice = prices.find((price) => price.productId === basePlan?.id);
  const proPrice = prices.find((price) => price.productId === proPlan?.id);
  const enterprisePrice = prices.find((price) => price.productId === enterprisePlan?.id);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <PricingCard
          name={basePlan?.name || 'Base'}
          price={basePrice?.unitAmount || 800}
          interval={basePrice?.interval || 'month'}
          trialDays={basePrice?.trialPeriodDays || 7}
          features={[
            '最多5个工作区',
            '基础功能访问',
            '社区支持',
            '标准API访问限制',
            '基础数据分析',
            '每日备份'
          ]}
          priceId={basePrice?.id}
        />
        <PricingCard
          name={proPlan?.name || 'Pro'}
          price={proPrice?.unitAmount || 1500}
          interval={proPrice?.interval || 'month'}
          trialDays={proPrice?.trialPeriodDays || 7}
          features={[
            '无限工作区',
            '所有高级功能',
            '优先邮件支持',
            '高级API访问权限',
            '高级数据分析和报表',
            '实时备份',
            '自定义集成',
            '团队协作工具'
          ]}
          priceId={proPrice?.id}
          highlighted={true}
        />
        <PricingCard
          name={enterprisePlan?.name || 'Enterprise'}
          price={enterprisePrice?.unitAmount || 2500}
          interval={enterprisePrice?.interval || 'month'}
          trialDays={enterprisePrice?.trialPeriodDays || 7}
          features={[
            'Pro版所有功能',
            '专属客户经理',
            '24/7企业级支持',
            '无限API调用',
            '自定义数据分析',
            '多区域部署',
            'SLA保障',
            '安全合规保障',
            '专属培训'
          ]}
          priceId={enterprisePrice?.id}
        />
      </div>
    </main>
  );
}

function PricingCard({
  name,
  price,
  interval,
  trialDays,
  features,
  priceId,
  highlighted,
}: {
  name: string;
  price: number;
  interval: string;
  trialDays: number;
  features: string[];
  priceId?: string;
  highlighted?: boolean;
}) {
  return (
    <div className={`pt-6 ${highlighted ? 'ring-2 ring-orange-500 rounded-lg p-6' : 'p-6'}`}>
      <h2 className="text-2xl font-medium text-gray-900 mb-2">{name}</h2>
      <p className="text-sm text-gray-600 mb-4">
        with {trialDays} day free trial
      </p>
      <p className="text-4xl font-medium text-gray-900 mb-6">
        ${price / 100}{' '}
        <span className="text-xl font-normal text-gray-600">
          per user / {interval}
        </span>
      </p>
      <ul className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check className="h-5 w-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>
      <form action={checkoutAction}>
        <input type="hidden" name="priceId" value={priceId} />
        <SubmitButton />
      </form>
    </div>
  );
}
