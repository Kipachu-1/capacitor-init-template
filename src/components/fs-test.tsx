import { useState } from "react";
import { PodcastStorage } from "@/services/podcast/fs";
import { Button } from "@/components/ui/button";

export function FileSystemTest() {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const runTest = async () => {
    setLoading(true);
    try {
      const testResult = await PodcastStorage.testFileSystem();
      setResult(testResult);
    } catch (error) {
      setResult(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-lg font-bold mb-4">File System Test</h2>
      <Button onClick={runTest} disabled={loading} className="mb-4">
        {loading ? "Testing..." : "Test File System"}
      </Button>

      {result && (
        <div className="mt-4 p-3 bg-gray-100 rounded">
          <pre className="whitespace-pre-wrap">{result}</pre>
        </div>
      )}
    </div>
  );
}
