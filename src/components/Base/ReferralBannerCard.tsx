import React from "react";
import { Card, Tag, Typography, Button } from "antd";
import { CopyOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export interface ReferralBannerCardProps {
  referralCode?: string;
  commissionText?: string;
  commissionPercent?: number;
  loading?: boolean;
  onCopy: () => void;
}

const ReferralBannerCard: React.FC<ReferralBannerCardProps> = ({
  referralCode,
  commissionText,
  commissionPercent,
  loading = false,
  onCopy,
}) => {
  return (
    <Card
      loading={loading}
      className="!mb-7 !min-h-[149px] !rounded-[17px] !border-0 !bg-gradient-to-r !from-fuchsia-600 !via-pink-600 !to-rose-500 !p-[22px] !shadow-[0_10px_17px_rgba(190,24,93,.2)] [&_.ant-card-body]:!flex [&_.ant-card-body]:!items-center [&_.ant-card-body]:!justify-between [&_.ant-card-body]:!gap-5 [&_.ant-card-body]:!p-0 max-[800px]:[&_.ant-card-body]:!flex-col max-[800px]:[&_.ant-card-body]:!items-start"
    >
      <div className="text-white">
        <Tag className="!m-0 !rounded-full !border-0 !bg-white/25 !px-3 !py-[3px] !text-xs !font-bold !text-white">
          <span>✣</span> Share &amp; Earn More
        </Tag>
        <Title level={2} className="!my-2 !text-[21px] !text-white">
          Your Personal Referral Link
        </Title>
        <Text className="!block !max-w-[555px] !text-[13px] !text-white/90">
          {commissionText ??
            (commissionPercent !== undefined
              ? `Earn up to ${commissionPercent}% on selected products your customers buy.`
              : "Share your code with friends and team members to earn commissions on every successful order placed.")}
        </Text>
      </div>
      <div className="flex items-center gap-[11px] rounded-[13px] border border-white/25 bg-white/15 p-[9px] pl-3 max-[800px]:w-full max-[800px]:flex-col max-[800px]:items-start">
        <span className="rounded-lg bg-white/20 px-[13px] py-2 text-xs text-white/85">
          Code:{" "}
          <strong className="ml-1 tracking-wider text-yellow-200">
            {referralCode ?? "—"}
          </strong>
        </span>
        <Button
          className="!h-[38px] !rounded-[9px] !border-0 !font-bold !text-fuchsia-700"
          icon={<CopyOutlined />}
          onClick={onCopy}
        >
          Copy Link
        </Button>
      </div>
    </Card>
  );
};

export default ReferralBannerCard;
