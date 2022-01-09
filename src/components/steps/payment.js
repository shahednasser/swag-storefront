import { Box, Card, Flex, Text } from "@theme-ui/components"
import { useCart } from "medusa-react"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import PaymentDetails from "../payment/payment"
import Review from "../payment/review"
import Total from "../payment/total"

const DeliveryReview = ({ delivery, displayCountry }) => (
  <Flex
    sx={{
      flexDirection: "column",
      borderBottom: "1px solid #E5E7EB",
      pb: "16px",
      pt: "8px",
    }}
  >
    <Text variant="subheading" sx={{ mb: "8px" }}>
      Delivery
    </Text>
    <Text variant="summary">{delivery.address_1}</Text>
    <Text variant="summary">{`${delivery.postal_code}, ${delivery.city}`}</Text>
    <Text variant="summary">{displayCountry}</Text>
  </Flex>
)

const Payment = ({ region, country, activeStep, setLoading }) => {
  const router = useRouter()
  const { cart, pay, completeCheckout } = useCart()

  const [fullCountry, setFullCountry] = useState("")

  const submitPayment = async () => {
    setLoading(true)
    // set Stripe as payment provider
    await pay.mutateAsync({ provider_id: "stripe" })
    // complete cart and go to order confirmation
    const { data } = await completeCheckout.mutateAsync()
    return router.push(`/completed?oid=${data.id}`)
  }

  useEffect(() => {
    if (activeStep === "payment") {
      setFullCountry(
        region.countries.find(c => c.iso_2 === country).display_name
      )
    }
  }, [country, region, activeStep])

  return (
    <Flex variant="layout.stepContainer">
      {activeStep === "payment" ? (
        <Card variant="container">
          <Text variant="header3">Payment</Text>
          <Box mt={"16px"}>
            <Review cart={cart} /> <Total cart={cart} />
            <DeliveryReview
              displayCountry={fullCountry}
              delivery={cart.shipping_address}
            />
            <Flex
              sx={{
                flexDirection: "column",
                py: "16px",
              }}
            >
              <Text variant="subheading" sx={{ mb: "8px" }}>
                Payment method
              </Text>
              <PaymentDetails
                handleSubmit={submitPayment}
                setLoading={setLoading}
              />
            </Flex>
          </Box>
        </Card>
      ) : (
        <Card variant="accordionTrigger">Payment</Card>
      )}
    </Flex>
  )
}

export default Payment