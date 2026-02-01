"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Tabs } from "antd";
import QualityMaster from "./QualityMaster";
import WidthMaster from "./WidthMaster";
import DesignMaster from "./DesignMaster";
import GradeMaster from "./GradeMaster";

type Props = {
  initialTabKey?: "quality" | "width" | "design" | "grade";
};

const TextileMasters: React.FC<Props> = ({ initialTabKey = "quality" }) => {
  const gradeMasterEnabled = true;
  const [activeKey, setActiveKey] = useState<Props["initialTabKey"]>("quality");

  useEffect(() => {
    setActiveKey(initialTabKey || "quality");
  }, [initialTabKey]);

  const items = useMemo(
    () => [
      { key: "quality", label: "Quality Master", children: <QualityMaster /> },
      { key: "width", label: "Width Master", children: <WidthMaster /> },
      { key: "design", label: "Design Master", children: <DesignMaster /> },
      ...(gradeMasterEnabled ? [{ key: "grade", label: "Grade Master", children: <GradeMaster /> }] : []),
    ],
    [gradeMasterEnabled]
  );

  return (
    <Tabs
      items={items}
      activeKey={activeKey}
      onChange={(key) => setActiveKey(key as Props["initialTabKey"])}
      tabBarGutter={16}
      destroyInactiveTabPane
    />
  );
};

export default TextileMasters;
