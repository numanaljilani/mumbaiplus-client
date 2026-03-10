// app/components/SessionCheckerWithUI.jsx
"use client";

import { useState, useEffect } from "react";
import { useCheckSessionMutation } from "../service/api/api";
import { useDispatch, useSelector } from "react-redux";
import { setToken, setUser } from "../service/slice/userSlice";

export default function SessionCheckerWithUI() {
  const [checkSession, { isLoading }] = useCheckSessionMutation();
  const [sessionStatus, setSessionStatus] = useState(null);

  const token = useSelector((state) => state?.user?.token?.token || {});
  const dispatch = useDispatch();
  useEffect(() => {
    const verifySession = async () => {
      try {
        console.log("🔍 Session Verification Started:", {
          hasToken: !!token,
          timestamp: new Date().toLocaleString(),
        });

        if (!token) {
          console.log("📭 No authentication token found");
          setSessionStatus({ valid: false, reason: "NO_TOKEN" });
          return;
        }

        const response = await checkSession().unwrap();

        // Console output with styling
        console.log(
          "%c✅ Session Active",
          "color: green; font-weight: bold; font-size: 14px;",
        );
        console.table({
          Status: response.status,
          Code: response.code,
          Message: response.message,
          "Token Expired": response.isTokenExpired || false,
          "Expires In": response.expiresIn || "N/A",
        });

        setSessionStatus({ valid: true, data: response });
      } catch (err) {
        console.log(
          "%c❌ Session Invalid",
          "color: red; font-weight: bold; font-size: 14px;",
        );

        // dispatch(setToken({  }));
        // dispatch(setUser({  }));
        if (err?.data) {
          console.table({
            "Error Code": err.data.code,
            "Error Message": err.data.message,
            "Token Expired": err.data.isTokenExpired || false,
            "Expired At": err.data.expiredAt || "N/A",
          });
        dispatch(setToken({  }));
        dispatch(setUser({  }));
          setSessionStatus({
            valid: false,
            error: err.data,
            isExpired: err.data.isTokenExpired,
          });
        } else {
          console.error("Unexpected error:", err);
        }
      }
    };

    verifySession();
  }, [checkSession]);

  // Optional: Show a small indicator (you can remove this if you want it invisible)
  if (process.env.NODE_ENV === "development") {
    return (
      <div className="fixed bottom-2 right-2 text-xs bg-gray-800 text-white px-2 py-1 rounded opacity-50 hover:opacity-100 transition-opacity">
        {isLoading
          ? "🔄 Checking..."
          : sessionStatus?.valid
            ? "✅ Session Valid"
            : "❌ No Session"}
      </div>
    );
  }

  return null;
}
