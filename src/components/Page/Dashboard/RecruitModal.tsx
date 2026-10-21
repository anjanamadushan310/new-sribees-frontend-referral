import React from "react";
import { Modal, Form, Input, Typography } from "antd";
import type { FormInstance } from "antd";
import type { RecruitPartnerPayload } from "../../../api/partner.api";

const { Text } = Typography;

export interface RecruitModalProps {
  open: boolean;
  onOk: () => void;
  onCancel: () => void;
  confirmLoading?: boolean;
  form: FormInstance<RecruitPartnerPayload>;
}

const RecruitModal: React.FC<RecruitModalProps> = ({
  open,
  onOk,
  onCancel,
  confirmLoading = false,
  form,
}) => {
  return (
    <Modal
      title="Recruit a partner"
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      okText="Recruit"
      confirmLoading={confirmLoading}
      destroyOnHidden
    >
      <Text type="secondary" className="!mb-4 !block">
        They join your team and you earn level-2 commission on their
        customers. Set their password here and share it with them yourself —
        there is no automatic invite email.
      </Text>
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        autoComplete="off"
      >
        <Form.Item
          label="Full Name"
          name="full_name"
          rules={[{ required: true, message: "Name is required" }]}
        >
          <Input
            size="large"
            placeholder="e.g. Nadeesha Fernando"
            autoComplete="off"
          />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Email is required" },
            { type: "email", message: "Enter a valid email" },
          ]}
        >
          <Input
            size="large"
            placeholder="partner@example.com"
            autoComplete="off"
          />
        </Form.Item>
        <Form.Item
          label="Phone"
          name="phone"
          rules={[
            {
              pattern: /^0\d{9}$/,
              message:
                "Enter a valid 10-digit phone number starting with 0 (e.g. 0771234567)",
            },
          ]}
        >
          <Input
            size="large"
            placeholder="07XXXXXXXX"
            maxLength={10}
            inputMode="numeric"
            autoComplete="off"
            onChange={(e) => {
              const cleaned = e.target.value.replace(/\D/g, "").slice(0, 10);
              form.setFieldValue("phone", cleaned);
            }}
          />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: "Set a password for them" },
            { min: 8, message: "At least 8 characters" },
          ]}
        >
          <Input.Password
            size="large"
            placeholder="Min 8 characters"
            autoComplete="new-password"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RecruitModal;
