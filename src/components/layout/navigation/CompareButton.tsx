
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useComparison } from "@/context/ComparisonContext";

const CompareButton = () => {
  const { motorcyclesToCompare } = useComparison();
  const compareCount = motorcyclesToCompare.length;
  const location = useLocation();

  if (compareCount === 0 || location.pathname.includes('/compare')) {
    return null;
  }

  return (
    <Link to="/compare">
      <Button variant="outline" size="sm">
        Compare ({compareCount})
      </Button>
    </Link>
  );
};

export default CompareButton;
