import { useForm } from "@tanstack/react-form";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { Button } from "#/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { apiFetch } from "#/lib/api";

const makeSlug = (name: string) =>
  name
    .toLowerCase()
    .replaceAll(/[^a-z0-9\s-]/g, "")
    .replaceAll(/\s+/g, "-");

const NewCourtPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      courtAddress: "",
      courtArea: "",
      courtDescription: "",
      courtName: "",
      courtRate: "",
      courtSlug: "",
      ownerEmail: "",
      ownerName: "",
      ownerPassword: "",
      ownerPhone: "",
    },
    onSubmit: async ({ value }) => {
      setError(null);
      try {
        await apiFetch("/api/admin/courts", {
          body: JSON.stringify({
            court: {
              address: value.courtAddress,
              amenities: [],
              description: value.courtDescription || undefined,
              hourlyRate: Number.parseInt(value.courtRate, 10),
              locationArea: value.courtArea,
              name: value.courtName,
              slug: value.courtSlug,
            },
            owner: {
              email: value.ownerEmail,
              name: value.ownerName,
              phone: value.ownerPhone || undefined,
              tempPassword: value.ownerPassword,
            },
          }),
          method: "POST",
        });
        navigate({ to: "/admin" });
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to create court"
        );
      }
    },
  });

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6">
        <Link to="/admin" className="text-sm text-primary hover:underline">
          ← Admin Panel
        </Link>
        <h1 className="mt-2 text-2xl font-bold">Onboard New Court</h1>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-6"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Court Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form.Field name="courtName">
              {(field) => (
                <div className="space-y-1.5">
                  <Label>Court Name</Label>
                  <Input
                    value={field.state.value}
                    onChange={(e) => {
                      field.handleChange(e.target.value);
                      form.setFieldValue("courtSlug", makeSlug(e.target.value));
                    }}
                    required
                  />
                </div>
              )}
            </form.Field>
            <form.Field name="courtSlug">
              {(field) => (
                <div className="space-y-1.5">
                  <Label>URL Slug</Label>
                  <Input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="e.g. sm-seaside"
                    pattern="[a-z0-9-]+"
                    required
                  />
                </div>
              )}
            </form.Field>
            <form.Field name="courtDescription">
              {(field) => (
                <div className="space-y-1.5">
                  <Label>Description</Label>
                  <Input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </div>
              )}
            </form.Field>
            <form.Field name="courtAddress">
              {(field) => (
                <div className="space-y-1.5">
                  <Label>Address</Label>
                  <Input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    required
                  />
                </div>
              )}
            </form.Field>
            <form.Field name="courtArea">
              {(field) => (
                <div className="space-y-1.5">
                  <Label>Location Area</Label>
                  <Input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="e.g. Cebu City"
                    required
                  />
                </div>
              )}
            </form.Field>
            <form.Field name="courtRate">
              {(field) => (
                <div className="space-y-1.5">
                  <Label>Hourly Rate (centavos)</Label>
                  <Input
                    type="number"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="50000 = ₱500/hr"
                    required
                  />
                </div>
              )}
            </form.Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Court Owner</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form.Field name="ownerName">
              {(field) => (
                <div className="space-y-1.5">
                  <Label>Owner Name</Label>
                  <Input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    required
                  />
                </div>
              )}
            </form.Field>
            <form.Field name="ownerEmail">
              {(field) => (
                <div className="space-y-1.5">
                  <Label>Owner Email</Label>
                  <Input
                    type="email"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    required
                  />
                </div>
              )}
            </form.Field>
            <form.Field name="ownerPassword">
              {(field) => (
                <div className="space-y-1.5">
                  <Label>Temporary Password</Label>
                  <Input
                    type="password"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    minLength={8}
                    required
                  />
                </div>
              )}
            </form.Field>
            <form.Field name="ownerPhone">
              {(field) => (
                <div className="space-y-1.5">
                  <Label>Phone (optional)</Label>
                  <Input
                    type="tel"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </div>
              )}
            </form.Field>
          </CardContent>
        </Card>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <form.Subscribe selector={(s) => s.isSubmitting}>
          {(isSubmitting) => (
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Court & Owner"}
            </Button>
          )}
        </form.Subscribe>
      </form>
    </div>
  );
};

export const Route = createFileRoute("/admin/courts/new")({
  component: NewCourtPage,
});
